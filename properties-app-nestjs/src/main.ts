import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS (equivalent to AddCors in .NET)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configure global validation (equivalent to ModelState in .NET)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if there are extra properties
      transform: true, // Transform types automatically
    }),
  );

  // Configure global prefix for all routes
  app.setGlobalPrefix('api');

  // Configure Swagger (equivalent to AddSwaggerGen in .NET)
  const config = new DocumentBuilder()
    .setTitle('Properties App API')
    .setDescription('API for managing properties and owners')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log('Application is running on: http://localhost:3001');
  console.log('Swagger documentation: http://localhost:3001/swagger');
  console.log('API endpoints now available at: http://localhost:3001/api/');
  console.log('   - Properties: http://localhost:3001/api/properties');
  console.log('   - Owners: http://localhost:3001/api/owners');
  console.log('   - Health: http://localhost:3001/api/health');
}

void bootstrap();
