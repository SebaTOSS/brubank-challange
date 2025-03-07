import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { UsersService } from './service/users.service';

@Module({
  imports: [HttpModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, UsersService],
  exports: [InvoicesService, UsersService],
})
export class InvoicesModule {}