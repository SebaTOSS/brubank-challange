import { UserDto } from "../../users/dto";

export interface CsvRow {
    [key: string]: string;
}

export interface ParsedRow {
    origin: string;
    destination: string;
    timestamp: string;
    duration: number;
}

export interface Call {
    destination: string;
    duration: number;
    timestamp: string;
    amount: number;
    metadata?: Record<string, any>;
}

export interface ProcessCallsResult {
    calls: Call[];
    totals: Record<string, number>;
}

export interface CalculateTotals {
    totalInternationalSeconds: number;
    totalNationalSeconds: number;
    totalFriendsSeconds: number;
    total: number;
}

export interface ParsedCallPayload {
    file: Express.Multer.File;
    phoneNumber: string;
    billingPeriodStart: string;
    billingPeriodEnds: string;
    user: UserDto;
}

export interface CallResponseDto {
    phoneNumber: string;
    duration: number;
    timestamp: string;
    amount: number;
}

export interface ProcessStreamParams {
    file: Express.Multer.File,
    phoneNumber: string,
    startDate: Date,
    endDate: Date,
    user: UserDto,
    friendCallCounts: Record<string, number>,
    calls: Call[],
}

export interface ParseRowParams {
    row: CsvRow;
    phoneNumber: string;
    startDate: Date;
    endDate: Date;
    friendCallCounts: Record<string, number>;
    user: UserDto;
    calls: Call[];
}

export interface BillingContextMetadata {
    user: UserDto;
    callCount?: number;
    timestamp?: string;
}