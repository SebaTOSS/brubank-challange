import { NationalTotalStrategy } from '../national-total.strategy';
import { Call } from '../../../../invoices/interfaces';

describe('NationalTotalStrategy', () => {
    let strategy: NationalTotalStrategy;

    beforeEach(() => {
        strategy = new NationalTotalStrategy();
    });

    it('should have the correct type', () => {
        expect(strategy.type).toBe('NATIONAL');
    });

    it('should accumulate duration for national calls', () => {
        const nationalCall: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-01',
            amount: 0,
            metadata: {
                isNational: true,
            },
        };
        strategy.processCall(nationalCall);
        expect(strategy.getResult()).toEqual(['totalNationalSeconds', 60]);
    });

    it('should not accumulate duration for non-national calls', () => {
        const intlCall: Call = {
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-02',
            amount: 90,
            metadata: {
                isNational: false,
            },
        };
        strategy.processCall(intlCall);
        expect(strategy.getResult()).toEqual(['totalNationalSeconds', 0]);
    });

    it('should accumulate multiple national calls', () => {
        const nationalCall1: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-01',
            amount: 0,
            metadata: {
                isNational: true,
            },
        };
        const nationalCall2: Call = {
            destination: '+54911111112',
            duration: 30,
            timestamp: '2025-01-02',
            amount: 0,
            metadata: {
                isNational: true,
            },
        };
        strategy.processCall(nationalCall1);
        strategy.processCall(nationalCall2);
        expect(strategy.getResult()).toEqual(['totalNationalSeconds', 90]);
    });

    it('should reset total to zero', () => {
        const nationalCall: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-01',
            amount: 0,
            metadata: {
                isNational: true,
            },
        };
        strategy.processCall(nationalCall);
        strategy.reset();
        expect(strategy.getResult()).toEqual(['totalNationalSeconds', 0]);
    });
});