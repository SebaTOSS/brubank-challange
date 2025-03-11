import { TotalizationStrategy } from '../interfaces';
import { StrategyType } from '../types';
import { Call } from '../../../invoices/interfaces';
import { TotalizationStrategyDecorator } from '../decorators/totalization-strategy.decorator';

@TotalizationStrategyDecorator()
export class NationalTotalStrategy implements TotalizationStrategy {
    readonly type = StrategyType.NATIONAL;
    private total = 0;

    processCall(call: Call): void {
        if (call.isNational) {
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