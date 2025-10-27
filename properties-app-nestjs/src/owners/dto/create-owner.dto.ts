import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  @ApiProperty({
    description: 'Full name of the owner',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @Length(5, 200, { message: 'Address must be between 5 and 200 characters' })
  @ApiProperty({
    description: 'Address of the owner',
    example: '123 Main Street, City, State 12345',
    minLength: 5,
    maxLength: 200,
  })
  address: string;
}
