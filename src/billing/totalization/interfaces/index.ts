import { Call } from "../../../invoices/interfaces";
import { StrategyType } from "../types";

export interface TotalizationStrategy {
    readonly type: StrategyType;
    processCall(call: Call): void;
    getResult(): [string, number];
    reset(): void;
}
