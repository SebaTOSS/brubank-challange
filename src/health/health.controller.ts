import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Live test' })
  @ApiResponse({ status: 200, description: 'System health is ok' })
  @ApiResponse({ status: 503, description: 'System is not working as expected' })
  checkLiveTest() {
    return this.healthService.checkLiveTest();
  }
}