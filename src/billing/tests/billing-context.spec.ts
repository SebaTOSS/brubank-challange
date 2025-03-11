import { ModuleRef } from '@nestjs/core';
import { BillingContextData } from '../strategies';
import { BillingContext } from '../billing-context';
import { UserDto } from '../../users/dto/user.dto';

const MOCK_USER: UserDto = {
    phoneNumber: '+549116543219',
    name: 'John Doe',
    address: 'Main St 123',
    friends: ['+549118765432']
};

const testContext: BillingContextData = {
    origin: '+549116543219',
    destination: '+549118765432',
    duration: 100,
    metadata: {
        user: MOCK_USER,
        callCount: 5
    }
};

const MOCKED_STRATEGY = {
    shouldApply: jest.fn(),
    calculateCost: jest.fn()
};

describe('BillingContextData', () => {
    let billingContext: BillingContext;

    beforeEach(async () => {
        const moduleRef = { get: jest.fn() } as unknown as ModuleRef;
        billingContext = new BillingContext(moduleRef);
    });

    it('should be defined', () => {
        expect(testContext).toBeDefined();
    });

    describe('registerStrategy', () => {
        it('should register a strategy', () => {
            billingContext.registerStrategy(MOCKED_STRATEGY);
            expect(billingContext['billingStrategies']).toHaveLength(1);
        });

        it('should not register a strategy twice', () => {
            billingContext.registerStrategy(MOCKED_STRATEGY);
            billingContext.registerStrategy(MOCKED_STRATEGY);
            expect(billingContext['billingStrategies']).toHaveLength(1);
        });
    });

    describe('calculateCost', () => {
        it('should calculate the cost of a call', () => {
            billingContext.registerStrategy(MOCKED_STRATEGY);
            MOCKED_STRATEGY.shouldApply.mockReturnValue(true);
            MOCKED_STRATEGY.calculateCost.mockReturnValue(100);

            const result = billingContext.calculateCost(testContext);

            expect(result).toBe(100);
        });

        it('should throw an error if no strategy is found', () => {
            expect(() => billingContext.calculateCost(testContext)).toThrow();
        });
    });
});