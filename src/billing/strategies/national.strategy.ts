import { ConfigService } from "@nestjs/config";
import { BillingStrategy, BillingContextData } from "./interfaces";
import { BillingStrategyDecorator } from "./decorators/billing-strategy.decorator";
import { isNationalCall } from "../../utils/utils";

@BillingStrategyDecorator()
export class NationalStrategy implements BillingStrategy {
    private rate: number;

    constructor(private configService: ConfigService) {
        this.rate = this.configService.get<number>('BILLING_NATIONAL_RATE');
    }

    shouldApply(context: BillingContextData): boolean {
        const { origin, destination } = context;

        return isNationalCall(origin, destination);
    }

    calculateCost(): number {
        return this.rate;
    }
}