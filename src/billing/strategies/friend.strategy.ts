import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BillingStrategy, BillingContextData } from "./billing-strategy";

@Injectable()
export class FriendStrategy implements BillingStrategy {
    private freeCalls: number;

    constructor(private configService: ConfigService) {
        this.freeCalls = this.configService.get<number>('billing.friends.freeCalls');
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