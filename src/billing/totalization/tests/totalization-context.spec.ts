import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TotalizationContext } from '../totalization-context';
import { TOTALIZATION_STRATEGY_METADATA } from '../decorators/totalization-strategy.decorator';
import { TotalizationStrategy } from '../interfaces';
import { Call } from '../../../invoices/interfaces';

describe('TotalizationContext', () => {
    let context: TotalizationContext;
    let moduleRef: ModuleRef;

    const mockStrategy: TotalizationStrategy = {
        type: 'DUMMY',
        processCall: jest.fn(),
        getResult: jest.fn(() => ['totalSeconds', 0]),
        reset: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TotalizationContext,
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

        context = module.get<TotalizationContext>(TotalizationContext);
        moduleRef = module.get<ModuleRef>(ModuleRef);

        Reflect.defineMetadata(TOTALIZATION_STRATEGY_METADATA, true, mockStrategy.constructor);
    });

    describe('onModuleInit', () => {
        it('should register strategies from ModuleRef on initialization', () => {
            context.onModuleInit();
            expect(context['totalizationStrategies']).toContain(mockStrategy);
        });

        it('should throw error if no strategies are found', () => {
            const emptyModules = new Map<string, { providers: Map<string, { instance: any }> }>();
            jest.spyOn(moduleRef['container'], 'getModules').mockReturnValue(emptyModules as ModulesContainer);

            expect(() => context.onModuleInit()).toThrow('No totalization strategies found');
        });
    });

    describe('registerStrategy', () => {
        it('should add a strategy to the list', () => {
            const newStrategy: TotalizationStrategy = {
                type: 'AMOUNT',
                processCall: jest.fn(),
                getResult: jest.fn(() => ['totalMock', 10]),
                reset: jest.fn(),
            };
            context.registerStrategy(newStrategy);
            expect(context['totalizationStrategies']).toContain(newStrategy);
        });
    });

    describe('processCalls', () => {
        it('should process multiple calls and reset totals', () => {
            const calls: Call[] = [
                {
                    destination: '+54911111111',
                    duration: 60,
                    timestamp: '2025-01-01',
                    amount: 0,
                    metadata: {
                        isFriend: true,
                        isNational: true,
                        isInternational: false,
                    },
                },
                {
                    destination: '+191167980952',
                    duration: 120,
                    timestamp: '2025-01-02',
                    amount: 90,
                    metadata: { isFriend: false, isNational: false, isInternational: true },
                },
            ];

            const strategy1: TotalizationStrategy = {
                type: 'DUMMY',
                processCall: jest.fn(),
                getResult: jest.fn(() => ['totalSeconds', 180]),
                reset: jest.fn(),
            };
            context.registerStrategy(strategy1);

            context.processCalls(calls);

            expect(strategy1.reset).toHaveBeenCalledTimes(1);
            expect(strategy1.processCall).toHaveBeenCalledTimes(2);
            expect(strategy1.processCall).toHaveBeenCalledWith(calls[0]);
            expect(strategy1.processCall).toHaveBeenCalledWith(calls[1]);
            expect(context.getTotals()).toEqual({ totalSeconds: 180 });
        });
    });

    describe('processCall', () => {
        it('should process a single call and update totals', () => {
            const call: Call = {
                destination: '+54911111111',
                duration: 60,
                timestamp: '2025-01-01',
                amount: 0,
                metadata: {
                    isFriend: true,
                    isNational: true,
                    isInternational: false,
                },
            };

            const strategy1: TotalizationStrategy = {
                type: 'DUMMY',
                processCall: jest.fn(),
                getResult: jest.fn(() => ['totalSeconds', 60]),
                reset: jest.fn(),
            };
            context.registerStrategy(strategy1);

            context.processCall(call);

            expect(strategy1.processCall).toHaveBeenCalledWith(call);
            expect(context.getTotals()).toEqual({ totalSeconds: 60 });
        });
    });

    describe('getTotals', () => {
        it('should return a copy of the totals', () => {
            const strategy1: TotalizationStrategy = {
                type: 'DUMMY',
                processCall: jest.fn(),
                getResult: jest.fn(() => ['totalSeconds', 100]),
                reset: jest.fn(),
            };
            context.registerStrategy(strategy1);

            context.processCall({} as Call);
            const totals = context.getTotals();

            expect(totals).toEqual({ totalSeconds: 100 });
            totals['totalSeconds'] = 999;
            expect(context.getTotals()).toEqual({ totalSeconds: 100 });
        });
    });

    describe('initialize', () => {
        it('should reset strategies and totals', () => {
            const strategy1: TotalizationStrategy = {
                type: 'DUMMY',
                processCall: jest.fn(),
                getResult: jest.fn(() => ['totalSeconds', 60]),
                reset: jest.fn(),
            };
            context.registerStrategy(strategy1);

            context['totals'] = { totalSeconds: 100 };
            context.initialize();

            expect(strategy1.reset).toHaveBeenCalledTimes(1);
            expect(context.getTotals()).toEqual({});
        });
    });
});