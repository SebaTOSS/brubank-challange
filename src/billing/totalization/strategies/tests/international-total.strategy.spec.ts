import { InternationalTotalStrategy } from '../international-total.strategy';
import { Call } from '../../../../invoices/interfaces';

describe('InternationalTotalStrategy', () => {
    let strategy: InternationalTotalStrategy;

    beforeEach(() => {
        strategy = new InternationalTotalStrategy();
    });

    it('should have the correct type', () => {
        expect(strategy.type).toBe('INTERNATIONAL');
    });

    it('should accumulate duration for international calls', () => {
        const intlCall: Call = {
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-01',
            amount: 90,
            metadata: {
                isInternational: true,
            },
        };
        strategy.processCall(intlCall);
        expect(strategy.getResult()).toEqual(['totalInternationalSeconds', 120]);
    });

    it('should not accumulate duration for non-international calls', () => {
        const nationalCall: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-02',
            amount: 0,
            metadata: {
                isInternational: false,
            }
        };
        strategy.processCall(nationalCall);
        expect(strategy.getResult()).toEqual(['totalInternationalSeconds', 0]);
    });

    it('should accumulate multiple international calls', () => {
        const intlCall1: Call = {
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-01',
            amount: 90,
            metadata: {
                isInternational: true
            },
        };
        const intlCall2: Call = {
            destination: '+191167980953',
            duration: 180,
            timestamp: '2025-01-02',
            amount: 135,
            metadata: {
                isInternational: true
            },
        };
        strategy.processCall(intlCall1);
        strategy.processCall(intlCall2);
        expect(strategy.getResult()).toEqual(['totalInternationalSeconds', 300]);
    });

    it('should reset total to zero', () => {
        const intlCall: Call = {
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-01',
            amount: 90,
            metadata: {
                isInternational: true,
            },
        };
        strategy.processCall(intlCall);
        strategy.reset();
        expect(strategy.getResult()).toEqual(['totalInternationalSeconds', 0]);
    });
});