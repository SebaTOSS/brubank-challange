import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternationalStrategy } from '../international.strategy';
import { BillingContextData } from '../interfaces';
import { UserDto } from '../../../users/dto/user.dto';

const MOCK_USER: UserDto = {
    phoneNumber: '+549116543219',
    name: 'John Doe',
    address: 'Main St 123',
    friends: ['+549118765432']
};

const RATE = 0.75;

describe('InternationalStrategy', () => {
    let strategy: InternationalStrategy;
    const mockConfig = { get: jest.fn() };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                InternationalStrategy,
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        strategy = module.get<InternationalStrategy>(InternationalStrategy);
        mockConfig.get.mockReturnValue(RATE);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('shouldApply', () => {
        it('should return true when the call is international', () => {
            const context: BillingContextData = {
                origin: '+549116543219',
                destination: '+123456789',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };

            expect(strategy.shouldApply(context)).toBe(true);
        });

        it('should return false when the call is not international', () => {
            const context: BillingContextData = {
                origin: '+549116543219',
                destination: '+549118765432',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };

            expect(strategy.shouldApply(context)).toBe(false);
        });
    });

    describe('calculateCost', () => {
        it('should return the cost of the call', () => {
            const context: BillingContextData = {
                origin: '+549116543219',
                destination: '+123456789',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };

            expect(strategy.calculateCost(context)).toBe(7.5);
        });
    });
});