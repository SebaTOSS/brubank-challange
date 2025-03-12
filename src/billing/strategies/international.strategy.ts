import { ConfigService } from '@nestjs/config';
import { BillingContextData, BillingStrategy } from './interfaces';
import { isInternationalCall } from '../../utils/utils';
import { BillingStrategyDecorator } from './decorators/billing-strategy.decorator';

@BillingStrategyDecorator()
export class InternationalStrategy implements BillingStrategy {
    private rate: number;

    constructor(private readonly configService: ConfigService) {
        this.rate = this.configService.get<number>('BILLING_INTERNATIONAL_RATE');
    }

    shouldApply(context: BillingContextData): boolean {
        const { origin, destination } = context;

        return isInternationalCall(origin, destination);
    }

    calculateCost(context: BillingContextData): number {
        const { duration } = context;
        
        return duration * this.rate;
    }
}