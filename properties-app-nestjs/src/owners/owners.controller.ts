import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './schemas/owner.schema';

@ApiTags('owners')
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  /**
   * Create a new owner
   * POST /owners
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new owner' })
  @ApiBody({ type: CreateOwnerDto })
  @ApiResponse({
    status: 201,
    description: 'Owner successfully created',
    type: Owner,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - owner already exists',
  })
  async create(@Body() createOwnerDto: CreateOwnerDto): Promise<Owner> {
    return this.ownersService.create(createOwnerDto);
  }

  /**
   * Get all owners
   * GET /owners
   */
  @Get()
  @ApiOperation({ summary: 'Get all owners' })
  @ApiResponse({
    status: 200,
    description: 'List of all owners',
    type: [Owner],
  })
  async findAll(): Promise<Owner[]> {
    return this.ownersService.findAll();
  }

  /**
   * Get owner by ID
   * GET /owners/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get owner by ID' })
  @ApiParam({
    name: 'id',
    description: 'Owner ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner found',
    type: Owner,
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  async findOne(@Param('id') id: string): Promise<Owner> {
    return this.ownersService.findOne(id);
  }

  /**
   * Update owner by ID
   * PUT /owners/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update owner by ID' })
  @ApiParam({
    name: 'id',
    description: 'Owner ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateOwnerDto })
  @ApiResponse({
    status: 200,
    description: 'Owner successfully updated',
    type: Owner,
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - owner with same data already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ): Promise<Owner> {
    return this.ownersService.update(id, updateOwnerDto);
  }

  /**
   * Delete owner by ID
   * DELETE /owners/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete owner by ID' })
  @ApiParam({
    name: 'id',
    description: 'Owner ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Owner successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Cannot delete owner because they have associated properties',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ownersService.remove(id);
  }
}
