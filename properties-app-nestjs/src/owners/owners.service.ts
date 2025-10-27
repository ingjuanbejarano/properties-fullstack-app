import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner, OwnerDocument } from './schemas/owner.schema';
import {
  Property,
  PropertyDocument,
} from '../properties/schemas/property.schema';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  private readonly logger = new Logger(OwnersService.name);

  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  /**
   * Create a new owner
   * @param createOwnerDto - Owner data to create
   * @returns Promise<Owner> - The created owner
   */
  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    try {
      // Check if owner already exists with same name and address
      const existingOwner = await this.ownerModel.findOne({
        name: createOwnerDto.name,
        address: createOwnerDto.address,
      });

      if (existingOwner) {
        throw new ConflictException(
          `Owner with name "${createOwnerDto.name}" and address "${createOwnerDto.address}" already exists`,
        );
      }

      const createdOwner = new this.ownerModel(createOwnerDto);
      return await createdOwner.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error creating owner: ${errorMessage}`);
    }
  }

  /**
   * Get all owners
   * @returns Promise<Owner[]> - List of all owners
   */
  async findAll(): Promise<Owner[]> {
    try {
      return await this.ownerModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error fetching owners: ${errorMessage}`);
    }
  }

  /**
   * Get owner by ID
   * @param id - Owner ID
   * @returns Promise<Owner> - The found owner
   */
  async findOne(id: string): Promise<Owner> {
    try {
      const owner = await this.ownerModel.findById(id).exec();

      if (!owner) {
        throw new NotFoundException(`Owner with ID ${id} not found`);
      }

      return owner;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error fetching owner: ${errorMessage}`);
    }
  }

  /**
   * Update an owner
   * @param id - Owner ID to update
   * @param updateOwnerDto - Data to update
   * @returns Promise<Owner> - The updated owner
   */
  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    try {
      // Check if another owner exists with same name and address when updating both fields
      if (updateOwnerDto.name && updateOwnerDto.address) {
        const existingOwner = await this.ownerModel.findOne({
          name: updateOwnerDto.name,
          address: updateOwnerDto.address,
          _id: { $ne: id },
        });

        if (existingOwner) {
          throw new ConflictException(
            `Owner with name "${updateOwnerDto.name}" and address "${updateOwnerDto.address}" already exists`,
          );
        }
      }

      const updatedOwner = await this.ownerModel
        .findByIdAndUpdate(id, updateOwnerDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedOwner) {
        throw new NotFoundException(`Owner with ID ${id} not found`);
      }

      return updatedOwner;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error updating owner: ${errorMessage}`);
    }
  }

  /**
   * Delete an owner
   * @param id - Owner ID to delete
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if owner exists
      const owner = await this.ownerModel.findById(id).exec();
      if (!owner) {
        throw new NotFoundException(`Owner with ID ${id} not found`);
      }

      // Check if owner has associated properties
      const propertiesCount = await this.propertyModel
        .countDocuments({ idOwner: id })
        .exec();
      if (propertiesCount > 0) {
        throw new ConflictException(
          'Cannot delete owner because they have associated properties',
        );
      }

      // Delete the owner
      await this.ownerModel.findByIdAndDelete(id).exec();

      this.logger.log(`Owner with ID ${id} successfully deleted`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error deleting owner: ${errorMessage}`);
    }
  }

  /**
   * Check if an owner exists with the given ID
   * @param id - Owner ID
   * @returns Promise<boolean> - true if exists, false if not
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.ownerModel.countDocuments({ _id: id }).exec();
      return count > 0;
    } catch {
      return false;
    }
  }
}
