import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheckResult } from '@nestjs/terminus';
import { EXTERNAL_USERS_API_URL } from '../invoices/constants';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  checkLiveTest(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.http.pingCheck('Users API', EXTERNAL_USERS_API_URL),
    ]);
  }
}