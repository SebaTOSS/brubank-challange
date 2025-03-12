import { Injectable } from '@nestjs/common';
import { InvoiceResponseDto } from '../dto';
import { UsersService } from '../../users/service/users.service';
import { UserDto } from '../../users/dto';
import {
  Call,
  ParsedCallPayload,
  CallResponseDto,
} from '../interfaces';
import { CallProcessingService } from './call-processing.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly userService: UsersService,
    private readonly callProcessingService: CallProcessingService,
  ) { }

  async generateInvoice(
    file: Express.Multer.File,
    phoneNumber: string,
    billingPeriodStart: string,
    billingPeriodEnds: string
  ): Promise<InvoiceResponseDto> {
    const user: UserDto = await this.userService.getUserInfo(phoneNumber);
    const callsPayload: ParsedCallPayload = {
      file,
      phoneNumber,
      billingPeriodStart,
      billingPeriodEnds,
      user,
    };

    const { calls: rawCalls, totals } = await this.callProcessingService.processCalls(callsPayload);
    const calls = rawCalls.map(call => this.transformCall(call));

    return {
      user,
      calls,
      ...totals,
    };
  }

  private transformCall(call: Call): CallResponseDto {
    const {
      destination: phoneNumber,
      duration,
      timestamp,
      amount,
    } = call;

    return {
      phoneNumber,
      duration,
      timestamp,
      amount,
    };
  }
}