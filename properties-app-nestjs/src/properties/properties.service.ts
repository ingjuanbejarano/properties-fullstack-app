import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { OwnersService } from '../owners/owners.service';
import {
  PropertyStats,
  PropertyByOwner,
  CompleteStats,
} from './interfaces/property-stats.interface';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    private ownersService: OwnersService,
  ) {}

  /**
   * Create a new property
   * @param createPropertyDto - Property data to create
   * @returns Promise<Property> - The created property
   */
  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      // Verify that the owner exists
      const ownerExists = await this.ownersService.exists(
        createPropertyDto.idOwner,
      );

      if (!ownerExists) {
        throw new BadRequestException(
          `Owner with ID ${createPropertyDto.idOwner} does not exist`,
        );
      }

      const createdProperty = new this.propertyModel(createPropertyDto);
      const savedProperty = await createdProperty.save();

      // Convert to plain object to avoid serialization issues
      return savedProperty.toObject();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to create property: ${errorMessage}`,
      );
    }
  }

  /**
   * Get all properties with optional filters
   * @param filters - Optional filters to apply
   * @returns Promise<Property[]> - List of filtered properties
   */
  async findAll(filters?: PropertyFiltersDto): Promise<Property[]> {
    try {
      const query: FilterQuery<PropertyDocument> = {};

      // Apply filters if they exist
      if (filters?.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }

      if (filters?.address) {
        query.address = { $regex: filters.address, $options: 'i' };
      }

      if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
        const priceFilter: Record<string, number> = {};
        if (filters.minPrice !== undefined) {
          priceFilter.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          priceFilter.$lte = filters.maxPrice;
        }
        query.price = priceFilter;
      }

      // Execute query and convert to plain objects to avoid serialization issues
      const result = await this.propertyModel
        .find(query)
        .sort({ createdAt: -1 })
        .exec();

      // Convert Mongoose documents to plain objects
      return result.map((doc) => doc.toObject());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to fetch properties: ${errorMessage}`,
      );
    }
  }

  /**
   * Get property by ID
   * @param id - Property ID
   * @returns Promise<Property> - The found property
   */
  async findOne(id: string): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(id).exec();

      if (!property) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      // Convert to plain object to avoid serialization issues
      return property.toObject();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error fetching property: ${errorMessage}`);
    }
  }

  /**
   * Update a property
   * @param id - Property ID to update
   * @param updatePropertyDto - Data to update
   * @returns Promise<Property> - The updated property
   */
  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    try {
      // If updating idOwner, verify that it exists
      if (updatePropertyDto.idOwner) {
        const ownerExists = await this.ownersService.exists(
          updatePropertyDto.idOwner,
        );

        if (!ownerExists) {
          throw new BadRequestException(
            `Owner with ID ${updatePropertyDto.idOwner} does not exist`,
          );
        }
      }

      const updatedProperty = await this.propertyModel
        .findByIdAndUpdate(id, updatePropertyDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      // Convert to plain object to avoid serialization issues
      return updatedProperty.toObject();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error updating property: ${errorMessage}`);
    }
  }

  /**
   * Delete a property
   * @param id - Property ID to delete
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    try {
      const deletedProperty = await this.propertyModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error deleting property: ${errorMessage}`);
    }
  }

  /**
   * Get properties by owner
   * @param idOwner - Owner ID
   * @returns Promise<Property[]> - List of owner's properties
   */
  async findByOwner(idOwner: string): Promise<Property[]> {
    try {
      // Verify that the owner exists
      const ownerExists = await this.ownersService.exists(idOwner);

      if (!ownerExists) {
        throw new NotFoundException(`Owner with ID ${idOwner} not found`);
      }

      const properties = await this.propertyModel
        .find({ idOwner })
        .sort({ createdAt: -1 })
        .exec();

      // Convert to plain objects to avoid serialization issues
      return properties.map((doc) => doc.toObject());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Error fetching properties by owner: ${errorMessage}`,
      );
    }
  }

  /**
   * Get property statistics
   * @returns Promise<CompleteStats> - Complete statistics
   */
  async getStatistics(): Promise<CompleteStats> {
    try {
      const [stats, propertiesByOwner] = await Promise.all([
        this.propertyModel.aggregate<PropertyStats>([
          {
            $group: {
              _id: null,
              totalProperties: { $sum: 1 },
              averagePrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
            },
          },
          {
            $project: {
              _id: 0,
              totalProperties: 1,
              averagePrice: { $round: ['$averagePrice', 2] },
              minPrice: 1,
              maxPrice: 1,
            },
          },
        ]),
        this.propertyModel.aggregate<PropertyByOwner>([
          {
            $group: {
              _id: '$idOwner',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              idOwner: { $toString: '$_id' },
              count: 1,
              _id: 0,
            },
          },
          { $sort: { count: -1 } },
        ]),
      ]);

      const generalStats: PropertyStats = stats[0] || {
        totalProperties: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
      };

      return {
        ...generalStats,
        propertiesByOwner,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to get statistics: ${errorMessage}`,
      );
    }
  }
}
