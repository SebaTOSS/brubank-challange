import { TotalizationStrategy } from '../interfaces';
import { TotalizationStrategyDecorator } from '../decorators/totalization-strategy.decorator';
import { Call } from '../../../invoices/interfaces';

@TotalizationStrategyDecorator()
export class NationalTotalStrategy implements TotalizationStrategy {
    public readonly type = 'NATIONAL';
    private total = 0;

    processCall(call: Call): void {
        if (call.metadata?.isNational) {
            this.total += call.duration;
        }
    }

    reset(): void {
        this.total = 0;
    }

    getResult(): [string, number] {
        return ['totalNationalSeconds', this.total];
    }
}