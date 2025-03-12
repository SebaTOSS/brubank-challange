import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { BillingContext } from '../billing-context';
import { BillingStrategy, BillingContextData } from '../strategies/interfaces';
import { BILLING_STRATEGY_METADATA } from '../strategies/decorators/billing-strategy.decorator';

describe('BillingContext', () => {
    let context: BillingContext;
    let moduleRef: ModuleRef;

    const mockStrategy: BillingStrategy = {
        shouldApply: jest.fn(() => false),
        calculateCost: jest.fn(() => 0),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: BillingContext,
                    useClass: class extends BillingContext {
                        onModuleInit = jest.fn();
                    },
                },
                {
                    provide: ModuleRef,
                    useValue: {
                        container: {
                            getModules: jest.fn(() => {
                                const modulesMap = new Map<string, { providers: Map<string, { instance: any }> }>();
                                modulesMap.set('testModule', {
                                    providers: new Map([['mockStrategy', { instance: mockStrategy }]]),
                                });
                                return modulesMap as ModulesContainer;
                            }),
                        },
                    },
                },
            ],
        }).compile();

        context = module.get<BillingContext>(BillingContext);
        moduleRef = module.get<ModuleRef>(ModuleRef);

        Reflect.defineMetadata(BILLING_STRATEGY_METADATA, true, mockStrategy.constructor);
    });

    describe('registerStrategy', () => {
        it('should add a new strategy to the list', () => {
            const newStrategy: BillingStrategy = {
                shouldApply: jest.fn(() => true),
                calculateCost: jest.fn(() => 10),
            };
            context.registerStrategy(newStrategy);
            expect(context['billingStrategies']).toContain(newStrategy);
        });

        it('should not add duplicate strategies', () => {
            const strategy: BillingStrategy = {
                shouldApply: jest.fn(() => true),
                calculateCost: jest.fn(() => 10),
            };
            context.registerStrategy(strategy);
            context.registerStrategy(strategy);
            expect(context['billingStrategies'].length).toBe(1);
            expect(context['billingStrategies']).toContain(strategy);
        });
    });

    describe('calculateCost', () => {
        it('should calculate cost using the first applicable strategy', () => {
            const strategy1: BillingStrategy = {
                shouldApply: jest.fn(() => false),
                calculateCost: jest.fn(() => 5),
            };
            const strategy2: BillingStrategy = {
                shouldApply: jest.fn(() => true),
                calculateCost: jest.fn(() => 10),
            };
            const strategy3: BillingStrategy = {
                shouldApply: jest.fn(() => true),
                calculateCost: jest.fn(() => 15),
            };

            context.registerStrategy(strategy1);
            context.registerStrategy(strategy2);
            context.registerStrategy(strategy3);

            const contextData: BillingContextData = {
                origin: '+54911111111',
                destination: '+54911111112',
                duration: 60,
                metadata: {
                    user: {
                        address: 'Avenida siempre viva',
                        name: 'Juan Sanchez',
                        phoneNumber: '+54911111111',
                        friends: ['+54911111112'],
                    }
                },
            };

            const cost = context.calculateCost(contextData);
            expect(cost).toBe(10);
            expect(strategy1.shouldApply).toHaveBeenCalledWith(contextData);
            expect(strategy2.shouldApply).toHaveBeenCalledWith(contextData);
            expect(strategy2.calculateCost).toHaveBeenCalledWith(contextData);
            expect(strategy3.shouldApply).not.toHaveBeenCalled();
        });

        it('should throw error if no strategy applies', () => {
            const strategy1: BillingStrategy = {
                shouldApply: jest.fn(() => false),
                calculateCost: jest.fn(() => 5),
            };
            context.registerStrategy(strategy1);

            const contextData: BillingContextData = {
                origin: '+54911111111',
                destination: '+191167980952',
                duration: 120,
                metadata: {
                    user: {
                        address: 'Avenida siempre viva',
                        name: 'Juan Sanchez',
                        phoneNumber: '+54911111111',
                        friends: ['+54911111112'],
                    }
                },
            };

            expect(() => context.calculateCost(contextData)).toThrow(
                'No strategy found for call: +54911111111->+191167980952',
            );
        });
    });
});