import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsMongoId({ message: 'Owner ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Owner ID is required' })
  @ApiProperty({
    description: 'ID of the property owner',
    example: '507f1f77bcf86cd799439011',
  })
  idOwner: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  @ApiProperty({
    description: 'Name of the property',
    example: 'Beautiful Family Home',
    minLength: 1,
    maxLength: 100,
  })
  name: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @Length(1, 200, { message: 'Address must be between 1 and 200 characters' })
  @ApiProperty({
    description: 'Address of the property',
    example: '456 Oak Avenue, Downtown, State 12345',
    minLength: 1,
    maxLength: 200,
  })
  address: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Type(() => Number) // Transforma string a number automáticamente
  @ApiProperty({
    description: 'Price of the property in dollars',
    example: 250000,
    minimum: 0.01,
  })
  price: number;
}
