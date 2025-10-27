import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PropertyFiltersDto {
  @IsOptional()
  @IsString({ message: 'Name filter must be a string' })
  @ApiPropertyOptional({
    description: 'Filter by property name (partial match)',
    example: 'Family Home',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Address filter must be a string' })
  @ApiPropertyOptional({
    description: 'Filter by property address (partial match)',
    example: 'Downtown',
  })
  address?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0.01, { message: 'Minimum price must be greater than 0' })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 100000,
    minimum: 0.01,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0.01, { message: 'Maximum price must be greater than 0' })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 500000,
    minimum: 0.01,
  })
  maxPrice?: number;
}
