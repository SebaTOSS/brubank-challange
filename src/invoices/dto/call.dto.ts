import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CallDto {
    @ApiProperty({ description: 'Phone number of the call destination', example: '+54911111111' })
    @IsString()
    phoneNumber: string;

    @ApiProperty({ description: 'Duration of the call in seconds', example: 60 })
    @IsNumber()
    duration: number;

    @ApiProperty({ description: 'Timestamp of the call', example: '2025-01-15T10:00:00Z' })
    @IsString()
    timestamp: string;

    @ApiProperty({ description: 'Amount charged for the call', example: 2.5 })
    @IsNumber()
    amount: number;
}