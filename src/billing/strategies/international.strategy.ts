import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingContextData, BillingStrategy } from './billing-strategy';
import { isInternationalCall } from '../../utils/utils';

@Injectable()
export class InternationalStrategy implements BillingStrategy {
    private rate: number;

    constructor(private readonly configService: ConfigService) {
        this.rate = this.configService.get<number>('billing.rates.international');
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