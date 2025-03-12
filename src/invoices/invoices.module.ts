import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { InvoicesService } from './service/invoices.service';
import { CallProcessingService } from './service/call-processing.service';
import { InvoicesController } from './controller/invoices.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, BillingModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, CallProcessingService],
  exports: [InvoicesService],
})
export class InvoicesModule {}