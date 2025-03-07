import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  friends: string[];
}