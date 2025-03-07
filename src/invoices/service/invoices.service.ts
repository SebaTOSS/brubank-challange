import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { InvoiceResponseDto } from '../dto';
import { UsersService } from './users.service';
import { ROW_HEADERS } from '../constants';
import * as csv from 'csv-parser';
import * as moment from 'moment';

@Injectable()
export class InvoicesService {
  constructor(private readonly userService: UsersService) {}

  async generateInvoice(file: Express.Multer.File, phoneNumber: string, billingPeriodStart: string, billingPeriodEnds: string): Promise<InvoiceResponseDto> {
    const user = await this.userService.getUserInfo(phoneNumber);
    const calls = await this.parseCsv(file.buffer, phoneNumber, billingPeriodStart, billingPeriodEnds, user.friends);
    const totalInternationalSeconds = calls.reduce((acc, call) => acc + (call.isInternational ? call.duration : 0), 0);
    const totalNationalSeconds = calls.reduce((acc, call) => acc + (!call.isInternational ? call.duration : 0), 0);
    const totalFriendsSeconds = calls.reduce((acc, call) => acc + (call.isFriend ? call.duration : 0), 0);
    const total = calls.reduce((acc, call) => acc + call.amount, 0);

    return {
      user,
      calls: calls.map(call => ({
        phoneNumber: call.destination,
        duration: call.duration,
        timestamp: call.timestamp,
        amount: call.amount,
      })),
      totalInternationalSeconds,
      totalNationalSeconds,
      totalFriendsSeconds,
      total,
    };
  }

  private parseCsv(buffer: Buffer, phoneNumber: string, billingPeriodStart: string, billingPeriodEnds: string, friends: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const calls = [];
      const startDate = moment(billingPeriodStart);
      const endDate = moment(billingPeriodEnds);
      const originCountryCode = this.extractCountryCode(phoneNumber);
      const stream = Readable.from(buffer.toString());
      
      stream.pipe(csv())
        .on('data', (row) => {
          const origin = row[ROW_HEADERS.ORIGIN];
          const destination = row[ROW_HEADERS.DESTINATION];
          const duration = parseInt(row[ROW_HEADERS.DURATION], 10);
          const timestamp = row[ROW_HEADERS.TIMESTAMP];

          if (origin === phoneNumber && moment(timestamp).isBetween(startDate, endDate, undefined, '[]')) {
            const destinationCountryCode = this.extractCountryCode(destination);
            const isInternational = originCountryCode !== destinationCountryCode;
            const isFriend = friends.includes(destination);
            const amount = this.calculateCallAmount(duration, isInternational);

            calls.push({ destination, duration, timestamp, isInternational, isFriend, amount });
          }
        })
        .on('end', () => resolve(calls))
        .on('error', (error) => reject(error));
    });
  }

  private extractCountryCode(phoneNumber: string): string {
    const match = phoneNumber.match(/^\+(\d{1,3})/);
    return match ? match[1] : '';
  }

  private calculateCallAmount(duration: number, isInternational: boolean): number {
    if (isInternational) {
      return duration * 1.0;
    } else {
      return duration * 0.02;
    }
  }
}