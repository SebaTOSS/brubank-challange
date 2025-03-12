import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FriendStrategy } from '../friend.strategy';
import { BillingContextData } from '../interfaces';
import { UserDto } from '../../../users/dto/user.dto';

const MOCK_USER: UserDto = {
  phoneNumber: '+549116543219',
  name: 'John Doe',
  address: 'Main St 123',
  friends: ['+549118765432']
};

const FREE_FRIEND_CALLS_LIMIT = 10;

describe('FriendStrategy', () => {
    let strategy: FriendStrategy;
    const mockConfig = { get: jest.fn() };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FriendStrategy,
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        strategy = module.get<FriendStrategy>(FriendStrategy);
        mockConfig.get.mockReturnValue(FREE_FRIEND_CALLS_LIMIT);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('shouldApply', () => {
    
        it('should return true when the call is to a friend and the user has free calls available', () => {
            const context: BillingContextData = {
                origin: MOCK_USER.phoneNumber,
                destination: MOCK_USER.friends[0],
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };
    
            expect(strategy.shouldApply(context)).toBe(true);
        });
    
        it('should return false when the call is not to a friend', () => {
            const context: BillingContextData = {
                origin: MOCK_USER.phoneNumber,
                destination: '+549118765433',
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };
    
            expect(strategy.shouldApply(context)).toBe(false);
        });
    
        it('should return false when the user has no free calls available', () => {
            const context: BillingContextData = {
                origin: MOCK_USER.phoneNumber,
                destination: MOCK_USER.friends[0],
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 15 },
            };
    
            expect(strategy.shouldApply(context)).toBe(false);
        });
    });

    describe('calculateCost', () => {
        it('should return 0 for the cost of the call', () => {
            const context: BillingContextData = {
                origin: MOCK_USER.phoneNumber,
                destination: MOCK_USER.friends[0],
                duration: 10,
                metadata: { user: MOCK_USER, callCount: 5 },
            };
    
            expect(strategy.calculateCost(context)).toBe(0);
        });
    });
});