import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheckResult } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) { }

  checkLiveTest(): Promise<HealthCheckResult> {
    const externalUsersAPI = this.configService.get<string>('EXTERNAL_USERS_API_URL');
    const usersURL = `${externalUsersAPI}/+11111111111`;

    return this.health.check([
      () => this.http.pingCheck('Users API', usersURL),
    ]);
  }
}