import { Call } from "../../../invoices/interfaces";

export interface TotalizationStrategy {
    type: string;
    processCall(call: Call): void;
    getResult(): [string, number];
    reset(): void;
}
