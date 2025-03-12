import { TotalizationStrategy } from '../interfaces';
import { StrategyType } from '../types';
import { Call } from '../../../invoices/interfaces';
import { TotalizationStrategyDecorator } from '../decorators/totalization-strategy.decorator';

@TotalizationStrategyDecorator()
export class TotalizationAmountStrategy implements TotalizationStrategy {
    readonly type = StrategyType.AMOUNT;
    private total = 0;

    processCall(call: Call): void {
        this.total += call.amount;
    }

    reset(): void {
        this.total = 0;
    }

    getResult(): [string, number] {
        return ['total', this.total];
    }
}