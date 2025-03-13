import { TotalizationStrategy } from "../interfaces";
import { TotalizationStrategyDecorator } from "../decorators/totalization-strategy.decorator";
import { Call } from '../../../invoices/interfaces';

@TotalizationStrategyDecorator()
export class InternationalTotalStrategy implements TotalizationStrategy {
    public readonly type =  'INTERNATIONAL';
    private total = 0;

    processCall(call: Call): void {
        if (call.metadata?.isInternational) {
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
