import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { InvoiceResponseDto } from '../dto';
import { UsersService } from '../../users/service/users.service';
import { BillingContextData } from '../../billing/strategies/billing-strategy';
import { BillingContext } from '../../billing/billing-context';
import { isBetweenDates, createDate, isInternationalCall } from '../../utils/utils';
import { ROW_HEADERS } from '../constants';
import {
  CsvRow,
  Call,
  CalculateTotals,
  ParsedCallPayload,
  ParseRowParams,
  BillingContextMetadata,
  CallResponseDto,
} from '../interfaces';
import * as csv from 'csv-parser';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly userService: UsersService,
    private billingContext: BillingContext,
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

    const origin = row[ROW_HEADERS.ORIGIN];
    const destination = row[ROW_HEADERS.DESTINATION];
    const duration = parseInt(row[ROW_HEADERS.DURATION], 10);
    const timestamp = row[ROW_HEADERS.TIMESTAMP];
    const shouldProcess = origin === phoneNumber && isBetweenDates(timestamp, startDate, endDate);

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

  private createCallRecord(
    context: BillingContextData,
    destination: string,
    duration: number,
    timestamp: string,
    isFriend: boolean
  ): Call {
    return {
      destination,
      duration,
      timestamp,
      amount: this.billingContext.calculateCost(context),
      isInternational: isInternationalCall(context.origin, destination),
      isFriend
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

  private calculateTotal(calls: Call[]): CalculateTotals {
    return {
      totalInternationalSeconds: calls.reduce((acc, call) => acc + (call.isInternational ? call.duration : 0), 0),
      totalNationalSeconds: calls.reduce((acc, call) => acc + (!call.isInternational ? call.duration : 0), 0),
      totalFriendsSeconds: calls.reduce((acc, call) => acc + (call.isFriend ? call.duration : 0), 0),
      total: calls.reduce((acc, call) => acc + call.amount, 0),
    };
  }

  private transformCall(call: Call): CallResponseDto {
    const { destination: phoneNumber, duration, timestamp, amount } = call;

    return {
      phoneNumber,
      duration,
      timestamp,
      amount,
    };
  }

  private isFriendCall(phoneNumber: string, friends: string[]): boolean {
    return friends.includes(phoneNumber);
  }
}