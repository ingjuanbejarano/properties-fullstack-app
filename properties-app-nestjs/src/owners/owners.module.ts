import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { Owner, OwnerSchema } from './schemas/owner.schema';
import {
  Property,
  PropertySchema,
} from '../properties/schemas/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService], // Export service for use in other modules
})
export class OwnersModule {}
