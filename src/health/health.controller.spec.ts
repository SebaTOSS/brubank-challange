import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
    let controller: HealthController;
    let service: HealthService;

    const mockHealthService = {
        checkLiveTest: jest.fn().mockResolvedValue({ status: 'ok' }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthService,
                    useValue: mockHealthService,
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        service = module.get<HealthService>(HealthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call checkHealth and return status', async () => {
        const result = await controller.checkLiveTest();
        expect(service.checkLiveTest).toHaveBeenCalled();
        expect(result).toEqual({ status: 'ok' });
    });
});