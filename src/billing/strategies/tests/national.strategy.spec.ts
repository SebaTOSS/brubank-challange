import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NationalStrategy } from '../national.strategy';
import { BillingContextData } from '../billing-strategy';
import { UserDto } from '../../../users/dto/user.dto';

const MOCK_USER: UserDto = {
    phoneNumber: '+549116543219',
    name: 'John Doe',
    address: 'Main St 123',
    friends: ['+549118765432']
};

const RATE = 2.5;

describe('NationalStrategy', () => {
    let strategy: NationalStrategy;
    const mockConfig = { get: jest.fn() };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                NationalStrategy,
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        strategy = module.get<NationalStrategy>(NationalStrategy);
        mockConfig.get.mockReturnValue(RATE);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('shouldApply', () => {
        it('should return true when the call is national', () => {
            const context: BillingContextData = {
                origin: '+549116543219',
                destination: '+549118765432',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };

            expect(strategy.shouldApply(context)).toBe(true);
        });

        it('should return false when the call is not national', () => {
            const context: BillingContextData = {
                origin: '+549116543219',
                destination: '+123456789',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };

            expect(strategy.shouldApply(context)).toBe(false);
        });
    });

    describe('calculateCost', () => {
        it('should return the national rate', () => {
            expect(strategy.calculateCost()).toBe(RATE);
        });
    });
});