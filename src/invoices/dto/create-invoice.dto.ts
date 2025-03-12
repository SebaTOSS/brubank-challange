import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, Validate } from 'class-validator';
import { IsEndDateAfterStartDate, IsPhoneNumber } from '../validators';

export class CreateInvoiceDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'CSV file containing the calls' })
  file: any;
  
  @ApiProperty({ description: 'Phone number of the user', example: '+54911111111' })
  @IsNotEmpty()
  @Validate(IsPhoneNumber)
  phoneNumber: string;

  @ApiProperty({ description: 'Billing period start date', example: '2025-01-01' })
  @IsNotEmpty()
  @IsDateString()
  billingPeriodStart: string;

  @ApiProperty({ description: 'Billing period end date', example: '2025-01-31' })
  @IsNotEmpty()
  @IsDateString()
  @Validate(IsEndDateAfterStartDate, ['billingPeriodStart'])
  billingPeriodEnds: string;
}