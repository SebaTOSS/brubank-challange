import { ConfigService } from "@nestjs/config";
import { BillingStrategy, BillingContextData } from "./interfaces";
import { BillingStrategyDecorator } from "./decorators/billing-strategy.decorator";

@BillingStrategyDecorator()
export class FriendStrategy implements BillingStrategy {
    private freeCalls: number;

    constructor(private configService: ConfigService) {
        this.freeCalls = this.configService.get<number>('BILLING_FREE_FRIEND_CALLS');
    }

    shouldApply(context: BillingContextData): boolean {
        const { destination, metadata } = context;
        const { user: { friends }, callCount = 0 } = metadata;
        const hasFreeCallAvaialable = callCount <= this.freeCalls;
        const isFriend = friends?.includes(destination);

        return isFriend && hasFreeCallAvaialable;
    }

    calculateCost(context: BillingContextData): number {
        return  0;
    }
}