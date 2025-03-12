import { TotalizationStrategy } from "../interfaces";
import { StrategyType } from "../types";
import { TotalizationStrategyDecorator } from "../decorators/totalization-strategy.decorator";
import { Call } from '../../../invoices/interfaces';

@TotalizationStrategyDecorator()
export class InternationalTotalStrategy implements TotalizationStrategy {
    public readonly type = StrategyType.INTERNATIONAL;
    private total = 0;

    processCall(call: Call): void {
        if (call.isInternational) {
            this.total += call.duration
        };
    }

    reset(): void {
        this.total = 0;
    }
    
    getResult(): [string, number] {
        return ['totalInternationalSeconds', this.total];
    }
}
