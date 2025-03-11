import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { InvoiceResponseDto } from '../dto';
import { UsersService } from '../../users/service/users.service';
import { BillingContextData } from '../../billing/strategies/interfaces';
import { BillingContext } from '../../billing/billing-context';
import { TotalizationContext } from '../../billing/totalization/totalization-context';
import {
  createDate,
  isBetweenDates,
  isNationalCall,
  isInternationalCall,
} from '../../utils/utils';
import {
  CsvRow,
  Call,
  ParsedCallPayload,
  ParseRowParams,
  BillingContextMetadata,
  CallResponseDto,
} from '../interfaces';
import { ROW_HEADERS } from '../constants';
import * as csv from 'csv-parser';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly userService: UsersService,
    private billingContext: BillingContext,
    private totalizationContext: TotalizationContext,
  ) { }

  async generateInvoice(
    file: Express.Multer.File,
    phoneNumber: string,
    billingPeriodStart: string,
    billingPeriodEnds: string
  ): Promise<InvoiceResponseDto> {
    const user = await this.userService.getUserInfo(phoneNumber);
    const callsPayload: ParsedCallPayload = {
      file,
      phoneNumber,
      billingPeriodStart,
      billingPeriodEnds,
      user,
    };

    const calls = await this.parseCsv(callsPayload);
    const totals = this.calculateTotal(calls);

    return {
      user,
      calls: calls.map(call => this.transformCall(call)),
      ...totals,
    };
  }

  private parseCsv(callsPayload: ParsedCallPayload): Promise<Call[]> {
    const { file, phoneNumber, billingPeriodStart, billingPeriodEnds, user } = callsPayload;

    return new Promise((resolve, reject) => {
      const calls: Call[] = [];
      const startDate = createDate(billingPeriodStart);
      const endDate = createDate(billingPeriodEnds);
      const friendCallCounts: Record<string, number> = {};
      const stream = Readable.from(file.buffer.toString());

      stream.pipe(csv())
        .on('data', (row: CsvRow) => {
          this.parseRow({
            row,
            phoneNumber,
            startDate,
            endDate,
            friendCallCounts,
            user,
            calls
          });
        })
        .on('end', () => resolve(calls))
        .on('error', (error) => reject(error));
    });
  }

  private parseRow(params: ParseRowParams): void {
    const { row, phoneNumber, startDate, endDate, friendCallCounts, user, calls } = params;

    const { origin, timestamp, destination, duration } = this.extractInvoiceData(row);
    const isPhoneToProcess = origin === phoneNumber;
    const isInProcessingPeriod = isBetweenDates(timestamp, startDate, endDate);
    const shouldProcess = isPhoneToProcess && isInProcessingPeriod;

    if (shouldProcess) {
      const isFriend = this.isFriendCall(destination, user.friends);
      const callCount = this.updateFriendCallCounts(destination, user.friends, friendCallCounts);

      const context: BillingContextData = {
        origin: phoneNumber,
        destination,
        duration,
        metadata: {
          user,
          callCount,
          timestamp,
        } as BillingContextMetadata,
      };

      const newCall = this.createCallRecord(context, destination, duration, timestamp, isFriend);
      calls.push(newCall);
    }
  }

  private extractInvoiceData(row: CsvRow): { origin: string, timestamp: string, destination: string, duration: number } {
    const origin = row[ROW_HEADERS.ORIGIN];
    const destination = row[ROW_HEADERS.DESTINATION];
    const duration = parseInt(row[ROW_HEADERS.DURATION], 10);
    const timestamp = row[ROW_HEADERS.TIMESTAMP];

    return {
      origin,
      timestamp,
      destination,
      duration,
    };
  }

  private createCallRecord(
    context: BillingContextData,
    destination: string,
    duration: number,
    timestamp: string,
    isFriend: boolean,
  ): Call {
    return {
      destination,
      duration,
      timestamp,
      isFriend,
      amount: this.billingContext.calculateCost(context),
      isInternational: isInternationalCall(context.origin, destination),
      isNational: isNationalCall(context.origin, destination),
    };
  }

  private updateFriendCallCounts(
    destination: string,
    friends: string[],
    friendCallCounts: Record<string, number>
  ): number {
    const isFriendCall = this.isFriendCall(destination, friends);
    if (isFriendCall) {
      friendCallCounts[destination] = (friendCallCounts[destination] || 0) + 1;

      return friendCallCounts[destination];
    }

    return 0;
  }

  private calculateTotal(calls: Call[]): any {
    return this.totalizationContext.processCalls(calls);
  }

  private transformCall(call: Call): CallResponseDto {
    const {
      destination: phoneNumber,
      duration,
      timestamp,
      amount,
      isNational,
      isInternational,
      isFriend,
    } = call;

    return {
      phoneNumber,
      duration,
      timestamp,
      amount,
      isNational,
      isInternational,
      isFriend,
    };
  }

  private isFriendCall(phoneNumber: string, friends: string[]): boolean {
    return friends.includes(phoneNumber);
  }
}