import { Injectable } from "@nestjs/common";
import { BillingContextData, BillingStrategy } from "./strategies/billing-strategy";

@Injectable()
export class BillingContext {
    private strategies: BillingStrategy[] = [];

    registerStrategy(strategy: BillingStrategy): void {
        if (!this.strategies.includes(strategy)) {
            this.strategies.push(strategy);
        }
    }

    calculateCost(context: BillingContextData): number {
        const strategy = this.strategies.find(strategy => strategy.shouldApply(context));

        if (!strategy) {
            throw new Error(`No strategy found for call: ${context.origin}->${context.destination}`);
        }

        return strategy.calculateCost(context);
    }
}