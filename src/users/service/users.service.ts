import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UserDto } from '../dto';

@Injectable()
export class UsersService {
    private externalUsersApiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.externalUsersApiUrl = this.configService.get<string>('USER_SERVICE_BASE_URL');
    }

    async getUserInfo(phoneNumber: string): Promise<UserDto> {
        const url = this.buildURL(phoneNumber);

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

    private buildURL(phoneNumber: string): string {
        return `${this.externalUsersApiUrl}/${phoneNumber}`;
    }
}