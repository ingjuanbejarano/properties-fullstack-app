import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { OwnersModule } from './owners/owners.module';
import { PropertiesModule } from './properties/properties.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // a temporary destination, though we use memory storage
    }),
    // Environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
    }),

    // MongoDB configuration (equivalent to AddDbContext in .NET)
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://jcbj1292_db_user:4z4aPO8MfqaMhgLP@properties-db.bi15r0m.mongodb.net/?retryWrites=true&w=majority&appName=properties-db',
    ),

    // Health checks module
    HealthModule,

    // Business modules
    OwnersModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
