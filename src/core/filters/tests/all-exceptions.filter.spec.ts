import { AllExceptionsFilter } from '../all-exceptions.filter';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let logger: Logger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              {
                provide: Logger,
                useValue: {
                  error: jest.fn(),
                },
              },
              {
                provide: AllExceptionsFilter,
                useFactory: (logger: Logger) => new AllExceptionsFilter(logger),
                inject: [Logger],
              },
            ],
          }).compile();
      
          filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
          logger = module.get<Logger>(Logger);
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });

    it('should log and handle HttpException', () => {
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockRequest = {
            url: '/test',
        };

        const mockHost = {
            switchToHttp: jest.fn().mockReturnThis(),
            getResponse: jest.fn().mockReturnValue(mockResponse),
            getRequest: jest.fn().mockReturnValue(mockRequest),
        } as unknown as ArgumentsHost;

        const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

        jest.spyOn(logger, 'error').mockImplementation();

        filter.catch(exception, mockHost);

        expect(logger.error).toHaveBeenCalledWith(
            `HTTP Status: ${HttpStatus.FORBIDDEN} Error Message: "Forbidden"`,
        );
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'Forbidden',
                path: mockRequest.url,
            }),
        );
    });

    it('should log and handle non-HttpException', () => {
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockRequest = {
            url: '/test',
        };

        const mockHost = {
            switchToHttp: jest.fn().mockReturnThis(),
            getResponse: jest.fn().mockReturnValue(mockResponse),
            getRequest: jest.fn().mockReturnValue(mockRequest),
        } as unknown as ArgumentsHost;

        const exception = new Error('Internal server error');

        jest.spyOn(logger, 'error').mockImplementation();

        filter.catch(exception, mockHost);

        expect(logger.error).toHaveBeenCalledWith(
            `HTTP Status: ${HttpStatus.INTERNAL_SERVER_ERROR} Error Message: "Internal server error"`,
        );
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            path: mockRequest.url,
            }),
        );
    });
});