import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from '../service/invoices.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { InvoiceResponseDto } from '../dto';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post('generate')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'CSV file and invoice details',
        type: CreateInvoiceDto,
    })
    @ApiResponse({
        status: 201,
        description: 'The invoice has been successfully generated.',
        type: InvoiceResponseDto,
    })
    async generateInvoice(
        @UploadedFile() file: Express.Multer.File,
        @Body() createInvoiceDto: CreateInvoiceDto,
    ): Promise<InvoiceResponseDto> {
        if (!file) {
            throw new BadRequestException('CSV file is required');
        }

        return this.invoicesService.generateInvoice(
            file,
            createInvoiceDto.phoneNumber,
            createInvoiceDto.billingPeriodStart,
            createInvoiceDto.billingPeriodEnds,
        );
    }
}