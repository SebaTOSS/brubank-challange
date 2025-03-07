import { plainToInstance } from 'class-transformer';
import { TransformToDto } from '../transform-to-dto.decorator';

class DummyDto {
    id: number;
    name: string;
}

class TestService {
    @TransformToDto(DummyDto)
    async getData() {
        return { id: 1, name: 'Test' };
    }

    @TransformToDto(DummyDto)
    async getDataArray() {
        return [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
        ];
    }
}

describe('TransformToDto Decorator', () => {
    let service: TestService;

    beforeEach(() => {
        service = new TestService();
    });

    it('should transform a single object to DTO', async () => {
        const result = await service.getData();
        expect(result).toBeInstanceOf(DummyDto);
        expect(result).toEqual(plainToInstance(DummyDto, { id: 1, name: 'Test' }));
    });

    it('should transform an array of objects to DTOs', async () => {
        const result = await service.getDataArray();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(DummyDto);
        expect(result[1]).toBeInstanceOf(DummyDto);
        expect(result).toEqual(plainToInstance(DummyDto, [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
        ]));
    });
});