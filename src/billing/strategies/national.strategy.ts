import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BillingStrategy, BillingContextData } from "./billing-strategy";
import { isNationalCall } from "../../utils/utils";

@Injectable()
export class NationalStrategy implements BillingStrategy {
    private rate: number;

    constructor(private configService: ConfigService) {
        this.rate = this.configService.get<number>('billing.rates.national');
    }

    shouldApply(context: BillingContextData): boolean {
        const { origin, destination } = context;

        return isNationalCall(origin, destination);
    }

    calculateCost(): number {
        return this.rate;
    }
}