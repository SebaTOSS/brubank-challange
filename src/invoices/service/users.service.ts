import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserDto } from '../dto';
import { EXTERNAL_USERS_API_URL } from '../constants';

@Injectable()
export class UsersService {
    constructor(private readonly httpService: HttpService) {}

    async getUserInfo(phoneNumber: string): Promise<UserDto> {
        const url = `${EXTERNAL_USERS_API_URL}/${phoneNumber}`;
        try {
            const response = await this.httpService.get(url).toPromise();

            const user = {
                ...response.data,
                friends: response.data.friends,
            };
            return user;
        } catch (error) {
            throw new NotFoundException(`User with phone number ${phoneNumber} not found`);
        }
    }
}