import { Test, TestingModule } from '@nestjs/testing';
import { CallProcessingService } from '../call-processing.service';
import { BillingContext } from '../../../billing/billing-context';
import { TotalizationContext } from '../../../billing/totalization/totalization-context';
import { ParsedCallPayload, ProcessCallsResult } from '../../interfaces';

describe('CallProcessingService', () => {
    let service: CallProcessingService;
    let billingContext: BillingContext;
    let totalizationContext: TotalizationContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CallProcessingService,
                {
                    provide: BillingContext,
                    useValue: {
                        calculateCost: jest.fn(),
                    },
                },
                {
                    provide: TotalizationContext,
                    useValue: {
                        setUpProcessCalls: jest.fn(),
                        processCall: jest.fn(),
                        getTotals: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CallProcessingService>(CallProcessingService);
        billingContext = module.get<BillingContext>(BillingContext);
        totalizationContext = module.get<TotalizationContext>(TotalizationContext);
    });

    it('should process calls and return calls with totals', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from(
                `numero origen,numero destino,duracion,fecha\n${phoneNumber},+54911111111,60,2025-01-15T10:00:00Z\n${phoneNumber},+191167980952,120,2025-01-20T10:00:00Z`,
            ),
        } as Express.Multer.File;

        const user = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };

        const payload: ParsedCallPayload = {
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
            user,
        };

        jest.spyOn(billingContext, 'calculateCost').mockImplementation((context) => {
            const { destination, duration } = context;
            if (destination === '+54911111111') return 0;
            if (destination === '+191167980952') return duration * 0.75;
            return 0;
        });

        jest.spyOn(totalizationContext, 'processCall').mockImplementation(() => { });
        jest.spyOn(totalizationContext, 'getTotals').mockReturnValue({
            total: 90,
            totalNationalSeconds: 60,
            totalInternationalSeconds: 120,
            totalFriendsSeconds: 60,
        });

        const result: ProcessCallsResult = await service.processCalls(payload);

        expect(result).toBeDefined();
        expect(result.calls).toHaveLength(2);
        expect(result.totals).toBeDefined();

        const [friendCall, intlCall] = result.calls;
        expect(friendCall).toEqual({
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-15T10:00:00Z',
            amount: 0,
            isFriend: true,
            isNational: true,
            isInternational: false,
        });
        expect(intlCall).toEqual({
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-20T10:00:00Z',
            amount: 90, // 120 * 0.75
            isFriend: false,
            isNational: false,
            isInternational: true,
        });

        expect(result.totals).toEqual({
            total: 90,
            totalNationalSeconds: 60,
            totalInternationalSeconds: 120,
            totalFriendsSeconds: 60,
        });

        expect(billingContext.calculateCost).toHaveBeenCalledTimes(2);
        expect(totalizationContext.processCall).toHaveBeenCalledTimes(2);
        expect(totalizationContext.getTotals).toHaveBeenCalledTimes(1);
    });

    it('should handle empty CSV and return empty calls with zero totals', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from('numero origen,numero destino,duracion,fecha\n'), // Solo encabezados
        } as Express.Multer.File;

        const user = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };

        const payload: ParsedCallPayload = {
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
            user,
        };

        jest.spyOn(totalizationContext, 'getTotals').mockReturnValue({ total: 0 });

        const result: ProcessCallsResult = await service.processCalls(payload);

        expect(result.calls).toHaveLength(0);
        expect(result.totals).toEqual({ total: 0 });
        expect(billingContext.calculateCost).not.toHaveBeenCalled();
        expect(totalizationContext.processCall).not.toHaveBeenCalled();
        expect(totalizationContext.getTotals).toHaveBeenCalledTimes(1);
    });

    it('should filter calls outside billing period', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from(
                `numero origen,numero destino,duracion,fecha\n${phoneNumber},+54911111111,60,2025-02-01T10:00:00Z`, // Fuera del período
            ),
        } as Express.Multer.File;

        const user = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };

        const payload: ParsedCallPayload = {
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
            user,
        };

        jest.spyOn(totalizationContext, 'getTotals').mockReturnValue({ total: 0 });

        const result: ProcessCallsResult = await service.processCalls(payload);

        expect(result.calls).toHaveLength(0);
        expect(result.totals).toEqual({ total: 0 });
        expect(totalizationContext.processCall).not.toHaveBeenCalled();
    });
});