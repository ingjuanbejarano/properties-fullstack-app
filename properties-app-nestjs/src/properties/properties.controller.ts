import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Express } from 'express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { Property } from './schemas/property.schema';
import { CompleteStats } from './interfaces/property-stats.interface';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Create a new property with optional image
   * POST /properties
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiOperation({ summary: 'Create a new property with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idOwner: {
          type: 'string',
          description: 'ID of the property owner',
          example: '507f1f77bcf86cd799439011',
        },
        name: {
          type: 'string',
          description: 'Name of the property',
          example: 'Beautiful Family Home',
        },
        address: {
          type: 'string',
          description: 'Address of the property',
          example: '456 Oak Avenue, Downtown, State 12345',
        },
        price: {
          type: 'number',
          description: 'Price of the property in dollars',
          example: 250000,
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Property image file (optional)',
        },
      },
      required: ['idOwner', 'name', 'address', 'price'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Property successfully created',
    type: Property,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or owner not found',
  })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ): Promise<Property> {
    // Validate image if provided
    if (imageFile) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];

      if (!allowedMimeTypes.includes(imageFile.mimetype)) {
        throw new BadRequestException(
          'Invalid image format. Only JPEG, PNG, and GIF are allowed.',
        );
      }

      // Check file size (maximum 5MB)
      const maxSize = 5 * 1024 * 1024;

      if (imageFile.size > maxSize) {
        throw new BadRequestException(
          'Image file too large. Maximum size is 5MB.',
        );
      }

      // Store raw buffer to match C# byte[] format
      createPropertyDto['image'] = imageFile.buffer;
    }

    return this.propertiesService.create(createPropertyDto);
  }

  /**
   * Get all properties with optional filters
   * GET /properties
   */
  @Get()
  @ApiOperation({ summary: 'Get all properties with optional filters' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by property name (partial match)',
    example: 'apartment',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    description: 'Filter by address (partial match)',
    example: 'Main Street',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
    example: 100000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
    example: 500000,
  })
  @ApiResponse({
    status: 200,
    description: 'List of properties (filtered if query params provided)',
    type: [Property],
  })
  async findAll(@Query() filters: PropertyFiltersDto): Promise<Property[]> {
    return this.propertiesService.findAll(filters);
  }

  /**
   * Get property statistics
   * GET /properties/statistics
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get property statistics' })
  @ApiResponse({
    status: 200,
    description:
      'Property statistics including totals, averages, and counts by owner',
    schema: {
      example: {
        totalProperties: 25,
        averagePrice: 275000,
        minPrice: 150000,
        maxPrice: 850000,
        propertiesByOwner: [
          { idOwner: '507f1f77bcf86cd799439011', count: 5 },
          { idOwner: '507f1f77bcf86cd799439012', count: 3 },
        ],
      },
    },
  })
  async getStatistics(): Promise<CompleteStats> {
    return this.propertiesService.getStatistics();
  }

  /**
   * Get properties by owner
   * GET /properties/by-owner/:idOwner
   */
  @Get('by-owner/:idOwner')
  @ApiOperation({ summary: 'Get properties by owner ID' })
  @ApiParam({
    name: 'idOwner',
    description: 'Owner ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'List of properties owned by the specified owner',
    type: [Property],
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  async findByOwner(@Param('idOwner') idOwner: string): Promise<Property[]> {
    return this.propertiesService.findByOwner(idOwner);
  }

  /**
   * Get property by ID
   * GET /properties/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({
    name: 'id',
    description: 'Property ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Property found',
    type: Property,
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  /**
   * Update property by ID
   * PUT /properties/:id
   */
  @Put(':id')
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiOperation({ summary: 'Update property by ID with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Property ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idOwner: {
          type: 'string',
          description: 'ID of the property owner',
          example: '507f1f77bcf86cd799439011',
        },
        name: {
          type: 'string',
          description: 'Name of the property',
          example: 'Beautiful Family Home',
        },
        address: {
          type: 'string',
          description: 'Address of the property',
          example: '456 Oak Avenue, Downtown, State 12345',
        },
        price: {
          type: 'number',
          description: 'Price of the property in dollars',
          example: 250000,
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Property image file (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Property successfully updated',
    type: Property,
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or owner not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ): Promise<Property> {
    // Validate image if provided
    if (imageFile) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];

      if (!allowedMimeTypes.includes(imageFile.mimetype)) {
        throw new BadRequestException(
          'Invalid image format. Only JPEG, PNG, and GIF are allowed.',
        );
      }

      // Check file size (maximum 5MB)
      const maxSize = 5 * 1024 * 1024;

      if (imageFile.size > maxSize) {
        throw new BadRequestException(
          'Image file too large. Maximum size is 5MB.',
        );
      }

      // Store raw buffer to match C# byte[] format
      (updatePropertyDto as any).image = imageFile.buffer;
    }

    return this.propertiesService.update(id, updatePropertyDto);
  }

  /**
   * Delete property by ID
   * DELETE /properties/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiParam({
    name: 'id',
    description: 'Property ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Property successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.propertiesService.remove(id);
  }
}
