import { TotalizationStrategy } from '../interfaces';
import { TotalizationStrategyDecorator } from '../decorators/totalization-strategy.decorator';
import { Call } from '../../../invoices/interfaces';

@TotalizationStrategyDecorator()
export class TotalizationAmountStrategy implements TotalizationStrategy {
    readonly type = 'AMOUNT';
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