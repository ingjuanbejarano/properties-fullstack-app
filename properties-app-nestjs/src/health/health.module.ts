import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule, // Main module for health checks
    HttpModule, // For HTTP health indicators
  ],
  controllers: [HealthController],
})
export class HealthModule {}
