import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import { BillingContext } from '../../billing/billing-context';
import { BillingContextData } from '../../billing/strategies';
import { TotalizationContext } from '../../billing/totalization/totalization-context';
import {
    CsvRow,
    Call,
    ParsedCallPayload,
    ParseRowParams,
    BillingContextMetadata,
    ProcessStreamParams,
    ProcessCallsResult,
} from '../interfaces';
import { ROW_HEADERS } from '../constants';
import { isNationalCall, isBetweenDates, isInternationalCall } from '../../utils/utils';
import * as csv from 'csv-parser';

@Injectable()
export class CallProcessingService {
    constructor(
        private readonly billingContext: BillingContext,
        private readonly totalizationContext: TotalizationContext,
    ) { }

    async processCalls(payload: ParsedCallPayload): Promise<ProcessCallsResult> {
        const { file, phoneNumber, billingPeriodStart, billingPeriodEnds, user } = payload;
        const startDate = new Date(billingPeriodStart);
        const endDate = new Date(billingPeriodEnds);
        const friendCallCounts: Record<string, number> = {};
        const calls: Call[] = [];
        const processStreamParams: ProcessStreamParams = {
            file,
            phoneNumber,
            startDate,
            endDate,
            user,
            friendCallCounts,
            calls,
        }

        await this.processCsvStream(processStreamParams);
        const totals = this.totalizationContext.getTotals();

        return { calls, totals };
    }

    private processCsvStream(params: ProcessStreamParams): Promise<void> {
        const { file, phoneNumber, startDate, endDate, user, friendCallCounts, calls } = params;
        this.totalizationContext.setUpProcessCalls();
        return new Promise((resolve, reject) => {
            const stream = Readable.from(file.buffer.toString());
            stream
                .pipe(csv())
                .on('data', (row: CsvRow) => {
                    const rowProcessParams: ParseRowParams = {
                        row,
                        phoneNumber,
                        startDate,
                        endDate,
                        user,
                        friendCallCounts,
                        calls,
                    };
                    const call = this.processRow(rowProcessParams);
                    if (call) {
                        calls.push(call);
                        this.totalizationContext.processCall(call);
                    }
                })
                .on('end', () => resolve())
                .on('error', (error) => reject(new BadRequestException(`Failed to parse CSV: ${error.message}`)));
        });
    }

    private processRow(params: ParseRowParams): Call | null {
        const { row, phoneNumber, startDate, endDate, user, friendCallCounts } = params;
        const { origin, timestamp, destination, duration } = this.extractInvoiceData(row);
        if (origin !== phoneNumber || !isBetweenDates(timestamp, startDate, endDate)) {
            return null;
        }

        const isFriend = this.isFriendCall(destination, user.friends);
        const callCount = this.updateFriendCallCounts(destination, user.friends, friendCallCounts);

        const context: BillingContextData = {
            origin,
            destination,
            duration,
            metadata: { user, callCount, timestamp } as BillingContextMetadata,
        };

        return this.createCallRecord(context, destination, duration, timestamp, isFriend);
    }

    private extractInvoiceData(row: CsvRow): { origin: string; timestamp: string; destination: string; duration: number } {
        const origin = row[ROW_HEADERS.ORIGIN];
        const destination = row[ROW_HEADERS.DESTINATION];
        const duration = parseInt(row[ROW_HEADERS.DURATION], 10);
        const timestamp = row[ROW_HEADERS.TIMESTAMP];

        if (!origin || !destination || isNaN(duration) || !timestamp) {
            throw new BadRequestException('Invalid CSV row format');
        }

        return { origin, timestamp, destination, duration };
    }

    private createCallRecord(
        context: BillingContextData,
        destination: string,
        duration: number,
        timestamp: string,
        isFriend: boolean,
    ): Call {
        const amount = this.billingContext.calculateCost(context);

        return {
            destination,
            duration,
            timestamp,
            isFriend,
            amount,
            isInternational: isInternationalCall(context.origin, destination),
            isNational: isNationalCall(context.origin, destination),
        };
    }

    private updateFriendCallCounts(destination: string, friends: string[], friendCallCounts: Record<string, number>): number {
        if (this.isFriendCall(destination, friends)) {
            friendCallCounts[destination] = (friendCallCounts[destination] || 0) + 1;
            return friendCallCounts[destination];
        }
        return 0;
    }

    private isFriendCall(phoneNumber: string, friends: string[]): boolean {
        return friends.includes(phoneNumber);
    }
}