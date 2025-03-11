import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InvoicesService } from '../invoices.service';
import { UsersService } from '../../../users/service/users.service';
import { BillingContext } from '../../../billing/billing-context';
import { TotalizationContext } from '../../../billing/totalization/totalization-context';
import { InvoiceResponseDto } from '../../dto';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let usersService: UsersService;
    let billingContext: BillingContext;
    let totalizationContext: TotalizationContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: UsersService,
                    useValue: {
                        getUserInfo: jest.fn(),
                    },
                },
                {
                    provide: BillingContext,
                    useValue: {
                        calculateCost: jest.fn(),
                    },
                },
                {
                    provide: TotalizationContext,
                    useValue: {
                        processCalls: jest.fn(),
                    },
                }
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        usersService = module.get<UsersService>(UsersService);
        billingContext = module.get<BillingContext>(BillingContext);
        totalizationContext = module.get<TotalizationContext>(TotalizationContext);
    });

    it('should generate an invoice with correct totals', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from(`numero origen,numero destino,duracion,fecha\n${phoneNumber},+54911111111,60,2025-01-15T10:00:00Z\n${phoneNumber},+191167980952,120,2025-01-20T10:00:00Z`),
        } as Express.Multer.File;

        const userResponse = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };

        jest.spyOn(usersService, 'getUserInfo').mockResolvedValue(userResponse);
        jest.spyOn(billingContext, 'calculateCost').mockImplementation((context) => {
            const { duration, destination } = context;
            if (destination === '+54911111111') {
                return 0;
            }
            if (destination === '+191167980952') {
                return duration * 0.75;
            }
        });
        jest.spyOn(totalizationContext, 'processCalls').mockReturnValue({
            totalInternationalSeconds: 120,
            totalNationalSeconds: 60,
            totalFriendsSeconds: 60,
            total: 90,
        });

        const result: InvoiceResponseDto = await service.generateInvoice(file, phoneNumber, billingPeriodStart, billingPeriodEnds);

        expect(result.user).toEqual(userResponse);
        expect(result.calls.length).toBe(2);
        expect(result.totalInternationalSeconds).toBe(120);
        expect(result.totalNationalSeconds).toBe(60);
        expect(result.totalFriendsSeconds).toBe(60);
        expect(result.total).toBe(90);
    });

    it('should throw NotFoundException if user does not exist', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from(`numero origen,numero destino,duracion,fecha\n${phoneNumber},+54911111111,60,2025-01-15T10:00:00Z`),
        } as Express.Multer.File;

        jest.spyOn(usersService, 'getUserInfo').mockRejectedValue(new NotFoundException());

        await expect(service.generateInvoice(file, phoneNumber, billingPeriodStart, billingPeriodEnds)).rejects.toThrow(NotFoundException);
    });

    it('should parse CSV correctly', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from(`numero origen,numero destino,duracion,fecha\n${phoneNumber},+54911111111,60,2025-01-15T10:00:00Z\n${phoneNumber},+191167980952,120,2025-01-20T10:00:00Z`),
        } as Express.Multer.File;

        const userResponse = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };

        jest.spyOn(usersService, 'getUserInfo').mockResolvedValue(userResponse);

        const calls = await service['parseCsv']({
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
            user: userResponse,
        });

        expect(calls.length).toBe(2);
        expect(calls[0].destination).toBe('+54911111111');
        expect(calls[0].duration).toBe(60);
        expect(calls[0].timestamp).toBe('2025-01-15T10:00:00Z');
        expect(calls[1].destination).toBe('+191167980952');
        expect(calls[1].duration).toBe(120);
        expect(calls[1].timestamp).toBe('2025-01-20T10:00:00Z');
    });
});