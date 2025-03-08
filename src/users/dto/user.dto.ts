import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Address of the user', example: 'Avenida siempre viva' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Name of the user', example: 'Juan Sanchez' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Phone number of the user', example: '+54911111111' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'List of friends phone numbers', example: ['+54911111111', '+54922222222'] })
  @IsArray()
  @IsString({ each: true })
  friends: string[];
}