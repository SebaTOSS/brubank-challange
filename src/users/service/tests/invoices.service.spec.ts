import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

const EXTERNAL_USERS_API_URL = 'https://users';

describe('UsersService', () => {
    let service: UsersService;
    let httpService: HttpService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(EXTERNAL_USERS_API_URL),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should return user info if user exists', async () => {
        const phoneNumber = '+5491167910920';
        const userResponse: AxiosResponse = {
            data: {
                address: 'Avenida siempre viva',
                name: 'Juan Sanchez',
                phone_number: phoneNumber,
                friends: ['+54911111111', '+54922222222'],
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: undefined
            },
        };

        jest.spyOn(httpService, 'get').mockReturnValue(of(userResponse));

        const result = await service.getUserInfo(phoneNumber);
        expect(result).toEqual(userResponse.data);
    });

    it('should throw NotFoundException if user does not exist', async () => {
        const phoneNumber = '+5491167910920';

        jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('User not found')));

        await expect(service.getUserInfo(phoneNumber)).rejects.toThrow(NotFoundException);
    });
});