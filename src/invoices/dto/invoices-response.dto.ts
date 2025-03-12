import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsObject, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CallDto } from './call.dto';
import { UserDto } from '../../users/dto/user.dto';

export class InvoiceResponseDto {
    @ApiProperty({ type: UserDto })
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ type: [CallDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CallDto)
    calls: CallDto[];

    @ApiProperty({ description: 'Total international seconds', example: 60 })
    @IsNumber()
    @IsOptional()
    totalInternationalSeconds?: number;
  
    @ApiProperty({ description: 'Total national seconds', example: 120 })
    @IsNumber()
    @IsOptional()
    totalNationalSeconds?: number;
  
    @ApiProperty({ description: 'Total friends seconds', example: 30 })
    @IsNumber()
    @IsOptional()
    totalFriendsSeconds?: number;
  
    @ApiProperty({ description: 'Total amount', example: 50.75 })
    @IsNumber()
    total?: number;
}