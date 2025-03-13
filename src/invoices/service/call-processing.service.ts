import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import { BillingContext } from '../../billing/billing-context';
import { BillingContextData } from '../../billing/strategies';
import { TotalizationContext } from '../../billing/totalization/totalization-context';
import { CallTypeContext } from '../../billing/type-strategies/call-type.context';
import { CallData, CallMetadata } from '../../billing/type-strategies/interfaces';
import {
    Call,
    CsvRow,
    ParsedRow,
    ParseRowParams,
    ParsedCallPayload,
    ProcessCallsResult,
    ProcessStreamParams,
    BillingContextMetadata,
} from '../interfaces';
import { ROW_HEADERS } from '../constants';
import { isBetweenDates } from '../../utils/utils';
import * as csv from 'csv-parser';

@Injectable()
export class CallProcessingService {
    constructor(
        private readonly billingContext: BillingContext,
        private readonly callTypeContext: CallTypeContext,
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
        };

        await this.processCsvStream(processStreamParams);
        const totals = this.totalizationContext.getTotals();

        const result: ProcessCallsResult = { calls, totals };
        
        return result;
    }

    private processCsvStream(params: ProcessStreamParams): Promise<void> {
        const { file, phoneNumber, startDate, endDate, user, friendCallCounts, calls } = params;
        this.callTypeContext.initialize();
        this.totalizationContext.initialize();
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
        const { row, phoneNumber, startDate, endDate, user } = params;
        const { origin, timestamp, destination, duration } = this.extractInvoiceData(row);
        
        const isPhoneNumber = origin === phoneNumber;
        const isInRange = isBetweenDates(timestamp, startDate, endDate);
        if (!isPhoneNumber || !isInRange) {
            return null;
        }

        const callData: CallData = {
            origin,
            destination,
            duration,
            timestamp,
            user,
        };
        const metadata = this.callTypeContext.processCall(callData);

        const context: BillingContextData = {
            origin,
            destination,
            duration,
            metadata: { ...metadata, user } as BillingContextMetadata,
        };

        return this.createCallRecord(context, destination, duration, timestamp);
    }

    private extractInvoiceData(row: CsvRow): ParsedRow {
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
    ): Call {
        const metadata = context.metadata as CallMetadata;
        const amount = this.billingContext.calculateCost(context);

        return {
            destination,
            duration,
            timestamp,
            amount,
            metadata,
        };
    }
}