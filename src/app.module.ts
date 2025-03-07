import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    HealthModule,
    InvoicesModule,
  ],
})
export class AppModule { }

