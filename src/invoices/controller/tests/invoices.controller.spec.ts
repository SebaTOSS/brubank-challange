import { Test } from '@nestjs/testing';
import { InvoicesController } from '../invoices.controller';
import { InvoicesService } from '../../service/invoices.service';

describe('InvoicesController', () => {
    let controller: InvoicesController;
    const mockService = {
        generateInvoice: jest.fn()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [InvoicesController],
            providers: [
                { provide: InvoicesService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<InvoicesController>(InvoicesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call generateInvoice', async () => {
        const mockInvoice = {
            user: {
                name: 'John Doe',
                phoneNumber: '1234567890',
            },
            calls: [],
            total: 0,
            totalInternational: 0,
            totalNational: 0,
        };
        mockService.generateInvoice.mockResolvedValue(mockInvoice);

        const file = {
            fieldname: 'file',
            originalname: 'test.csv',
            encoding: '7bit',
            mimetype: 'text/csv',
            buffer: Buffer.from(''),
            size: 0,
            destination: '',
            filename: 'test.csv',
            path: '/tmp/test.csv'
        } as Express.Multer.File;
        const createInvoiceDto = {
            file,
            phoneNumber: '1234567890',
            billingPeriodStart: '2022-01-01',
            billingPeriodEnds: '2022-01-31',
        };
        const result = await controller.generateInvoice(file, createInvoiceDto);

        expect(result).toEqual(mockInvoice);
        expect(mockService.generateInvoice).toHaveBeenCalledWith(
            file,
            createInvoiceDto.phoneNumber,
            createInvoiceDto.billingPeriodStart,
            createInvoiceDto.billingPeriodEnds,
        );
    });

    it('should throw an error if the file is missing', async () => {
        const createInvoiceDto = {
            file: undefined,
            phoneNumber: '1234567890',
            billingPeriodStart: '2022-01-01',
            billingPeriodEnds: '2022-01-31',
        };
        await expect(controller.generateInvoice(undefined, createInvoiceDto)).rejects.toThrow('CSV file is required');
    });
});