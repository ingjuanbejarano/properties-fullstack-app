import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// Property document type
export type PropertyDocument = Property & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'properties', // Explicit collection name
})
export class Property {
  @ApiProperty({
    description: 'Unique identifier for the property',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Owner', // Reference to Owner model (like FK in .NET)
  })
  @ApiProperty({
    description: 'Owner ID reference',
    example: '507f1f77bcf86cd799439011',
  })
  idOwner: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  @ApiProperty({
    description: 'Name of the property',
    example: 'Beautiful Family Home',
    maxLength: 100,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  @ApiProperty({
    description: 'Address of the property',
    example: '456 Oak Avenue, Downtown, State 12345',
    maxLength: 200,
  })
  address: string;

  @Prop({
    required: true,
    type: Number,
    min: 0.01,
    validate: {
      validator: function (value: number) {
        return value >= 0.01;
      },
      message: 'Price must be greater than 0',
    },
  })
  @ApiProperty({
    description: 'Price of the property in dollars',
    example: 250000,
    minimum: 0.01,
  })
  price: number;

  @Prop({
    type: Buffer, // Equivalent to byte[] in C#
    required: false,
  })
  @ApiProperty({
    description: 'Property image as binary data',
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Buffer;

  // Automatic timestamps
  @ApiProperty({
    description: 'Date when the property was created',
    example: '2023-10-03T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the property was last updated',
    example: '2023-10-03T10:00:00.000Z',
  })
  updatedAt: Date;
}

// Create Mongoose schema
export const PropertySchema = SchemaFactory.createForClass(Property);

// Virtual property for idProperty
PropertySchema.virtual('idProperty').get(function (this: PropertyDocument) {
  return this._id.toString();
});

// Include virtuals in JSON and Object serialization
PropertySchema.set('toJSON', { virtuals: true });
PropertySchema.set('toObject', { virtuals: true });

// Indexes for query optimization (equivalent to SQL Server indexes)
PropertySchema.index({ idOwner: 1 }); // Index on idOwner for fast queries
PropertySchema.index({ name: 'text', address: 'text' }); // Text index for searches
PropertySchema.index({ price: 1 }); // Index on price for range filters
