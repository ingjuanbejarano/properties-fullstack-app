import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property, PropertySchema } from './schemas/property.schema';
import { OwnersModule } from '../owners/owners.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    OwnersModule, // Import OwnersModule to use OwnersService
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
