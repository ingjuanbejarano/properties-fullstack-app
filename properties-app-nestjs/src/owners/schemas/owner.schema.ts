import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// Owner document type
export type OwnerDocument = Owner & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'owners', // Explicit collection name
})
export class Owner {
  @ApiProperty({
    description: 'Unique identifier for the owner',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  @ApiProperty({
    description: 'Full name of the owner',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
  })
  @ApiProperty({
    description: 'Address of the owner',
    example: '123 Main Street, City, State 12345',
    minLength: 5,
    maxLength: 200,
  })
  address: string;

  // Automatic timestamps (equivalent to audit in .NET)
  @ApiProperty({
    description: 'Date when the owner was created',
    example: '2023-10-03T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the owner was last updated',
    example: '2023-10-03T10:00:00.000Z',
  })
  updatedAt: Date;
}

// Create Mongoose schema
export const OwnerSchema = SchemaFactory.createForClass(Owner);

// Virtual for C# compatibility (idOwner)
OwnerSchema.virtual('idOwner').get(function (this: OwnerDocument) {
  return this._id.toString();
});

// Include virtuals in JSON and Object serialization
OwnerSchema.set('toJSON', { virtuals: true });
OwnerSchema.set('toObject', { virtuals: true });
