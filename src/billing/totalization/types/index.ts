export const StrategyType = {
    INTERNATIONAL: 'international',
    NATIONAL: 'national',
    FRIEND: 'friend',
    AMOUNT: 'amount'
  } as const;
  
  export type StrategyType = typeof StrategyType[keyof typeof StrategyType];