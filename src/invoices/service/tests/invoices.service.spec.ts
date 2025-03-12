import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../invoices.service';
import { UsersService } from '../../../users/service/users.service';
import { CallProcessingService } from '../call-processing.service';
import { InvoiceResponseDto } from '../../dto';
import { Call } from '../../interfaces';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let usersService: UsersService;
    let callProcessingService: CallProcessingService;

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
                    provide: CallProcessingService,
                    useValue: {
                        processCalls: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        usersService = module.get<UsersService>(UsersService);
        callProcessingService = module.get<CallProcessingService>(CallProcessingService);
    });

    it('should generate an invoice with user, transformed calls, and totals', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from('mock csv content'),
        } as Express.Multer.File;

        const user = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };
        jest.spyOn(usersService, 'getUserInfo').mockResolvedValue(user);

        const rawCalls: Call[] = [
            {
                destination: '+54911111111',
                duration: 60,
                timestamp: '2025-01-15T10:00:00Z',
                amount: 0,
                isFriend: true,
                isNational: true,
                isInternational: false,
            },
            {
                destination: '+191167980952',
                duration: 120,
                timestamp: '2025-01-20T10:00:00Z',
                amount: 90,
                isFriend: false,
                isNational: false,
                isInternational: true,
            },
        ];
        const totals = {
            total: 90,
            totalNationalSeconds: 60,
            totalInternationalSeconds: 120,
            totalFriendsSeconds: 60,
        };
        jest.spyOn(callProcessingService, 'processCalls').mockResolvedValue({ calls: rawCalls, totals });

        const result: InvoiceResponseDto = await service.generateInvoice(
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
        );

        expect(result).toBeDefined();
        expect(result.user).toEqual({
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        });

        expect(result.calls).toHaveLength(2);
        const [friendCall, intlCall] = result.calls;
        expect(friendCall).toEqual({
            phoneNumber: '+54911111111',
            duration: 60,
            timestamp: '2025-01-15T10:00:00Z',
            amount: 0,
        });
        expect(intlCall).toEqual({
            phoneNumber: '+191167980952',
            duration: 120,
            timestamp: '2025-01-20T10:00:00Z',
            amount: 90,
        });

        expect(result.total).toBe(90);
        expect(result.totalNationalSeconds).toBe(60);
        expect(result.totalInternationalSeconds).toBe(120);
        expect(result.totalFriendsSeconds).toBe(60);

        expect(usersService.getUserInfo).toHaveBeenCalledWith(phoneNumber);
        expect(callProcessingService.processCalls).toHaveBeenCalledWith({
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
            user,
        });
    });

    it('should handle empty calls and return invoice with zero totals', async () => {
        const phoneNumber = '+5491167910920';
        const billingPeriodStart = '2025-01-01';
        const billingPeriodEnds = '2025-01-31';
        const file = {
            buffer: Buffer.from('mock empty csv'),
        } as Express.Multer.File;

        const user = {
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        };
        jest.spyOn(usersService, 'getUserInfo').mockResolvedValue(user);

        jest.spyOn(callProcessingService, 'processCalls').mockResolvedValue({
            calls: [],
            totals: { total: 0 },
        });

        const result: InvoiceResponseDto = await service.generateInvoice(
            file,
            phoneNumber,
            billingPeriodStart,
            billingPeriodEnds,
        );

        expect(result.user).toEqual({
            phoneNumber,
            address: 'Avenida siempre viva',
            name: 'Juan Sanchez',
            friends: ['+54911111111'],
        });
        expect(result.calls).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.totalNationalSeconds).toBeUndefined();
        expect(result.totalInternationalSeconds).toBeUndefined();
        expect(result.totalFriendsSeconds).toBeUndefined();
    });
});