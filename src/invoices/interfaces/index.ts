import { UserDto } from "../../users/dto";

export interface CsvRow {
    [key: string]: string;
}

export interface Call {
    destination: string;
    duration: number;
    timestamp: string;
    amount: number;
    isInternational: boolean;
    isFriend: boolean;
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
    callCount: number;
    timestamp?: string;
}