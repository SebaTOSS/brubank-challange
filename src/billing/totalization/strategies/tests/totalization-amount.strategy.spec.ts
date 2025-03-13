import { TotalizationAmountStrategy } from '../totalization-amount.strategy';
import { Call } from '../../../../invoices/interfaces';

describe('TotalizationAmountStrategy', () => {
  let strategy: TotalizationAmountStrategy;

  beforeEach(() => {
    strategy = new TotalizationAmountStrategy();
  });

  it('should have the correct type', () => {
    expect(strategy.type).toBe('AMOUNT');
  });

  it('should accumulate amount for any call', () => {
    const call: Call = {
      destination: '+54911111111',
      duration: 60,
      timestamp: '2025-01-01',
      amount: 10,
      metadata: {
        isFriend: true,
        isNational: true,
        isInternational: false,
      },
    };
    strategy.processCall(call);
    expect(strategy.getResult()).toEqual(['total', 10]);
  });

  it('should accumulate zero amount when call has no cost', () => {
    const call: Call = {
      destination: '+54911111111',
      duration: 60,
      timestamp: '2025-01-01',
      amount: 0,
      metadata: {
        isFriend: true,
        isNational: true,
        isInternational: false,
      },
    };
    strategy.processCall(call);
    expect(strategy.getResult()).toEqual(['total', 0]);
  });

  it('should accumulate multiple calls with amounts', () => {
    const call1: Call = {
      destination: '+54911111111',
      duration: 60,
      timestamp: '2025-01-01',
      amount: 10,
      metadata: {
        isFriend: true,
        isNational: true,
        isInternational: false,
      },
    };
    const call2: Call = {
      destination: '+191167980952',
      duration: 120,
      timestamp: '2025-01-02',
      amount: 90,
      metadata: {
        isFriend: false,
        isNational: true,
        isInternational: true,
      },
    };
    strategy.processCall(call1);
    strategy.processCall(call2);
    expect(strategy.getResult()).toEqual(['total', 100]);
  });

  it('should reset total to zero', () => {
    const call: Call = {
      destination: '+54911111111',
      duration: 60,
      timestamp: '2025-01-01',
      amount: 10,
      metadata: {
        isFriend: true,
        isNational: true,
        isInternational: false,
      },
    };
    strategy.processCall(call);
    strategy.reset();
    expect(strategy.getResult()).toEqual(['total', 0]);
  });
});