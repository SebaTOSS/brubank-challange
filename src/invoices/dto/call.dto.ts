import { IsString, IsNumber } from 'class-validator';

export class CallDto {
    @IsString()
    phoneNumber: string;

    @IsNumber()
    duration: number;

    @IsString()
    timestamp: string;

    @IsNumber()
    amount: number;
}