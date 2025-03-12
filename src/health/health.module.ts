import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}