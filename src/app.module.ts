import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { BillingModule } from './billing/billing.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    HealthModule,
    UsersModule,
    BillingModule,
    InvoicesModule,
  ],
  providers: [
    
  ],
})
export class AppModule { }

