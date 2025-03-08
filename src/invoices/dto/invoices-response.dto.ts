import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { CallDto } from './call.dto';

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
    totalInternationalSeconds: number;

    @ApiProperty({ description: 'Total national seconds', example: 120 })
    @IsNumber()
    totalNationalSeconds: number;

    @ApiProperty({ description: 'Total friends seconds', example: 30 })
    @IsNumber()
    totalFriendsSeconds: number;

    @ApiProperty({ description: 'Total amount', example: 50.75 })
    @IsNumber()
    total: number;
}