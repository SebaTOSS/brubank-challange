import { UserDto } from "../../users/dto";

export interface BillingStrategy {
    shouldApply(context: BillingContextData): boolean;
    calculateCost(context: BillingContextData): number;
}

export interface BillingContextData {
    origin: string;
    destination: string;
    duration: number;
    metadata: {
        user: UserDto;
        callCount?: number;
    };
}