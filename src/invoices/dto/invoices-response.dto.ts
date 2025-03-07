import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { CallDto } from './call.dto';

export class InvoiceResponseDto {
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CallDto)
    calls: CallDto[];

    @IsNumber()
    totalInternationalSeconds: number;

    @IsNumber()
    totalNationalSeconds: number;

    @IsNumber()
    totalFriendsSeconds: number;

    @IsNumber()
    total: number;
}