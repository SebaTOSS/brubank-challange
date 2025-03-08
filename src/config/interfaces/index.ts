export interface BillingConfig {
    rates: {
        national: number;
        international: number;
    };
    friends: {
        freeCalls: number;
    };
}