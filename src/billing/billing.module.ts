import { Module, Inject } from "@nestjs/common";
import { BillingContext } from "./billing-context";
import { BillingStrategy, NationalStrategy, InternationalStrategy, FriendStrategy } from "./strategies";

@Module({
    providers: [
        BillingContext,
        FriendStrategy,
        InternationalStrategy,
        NationalStrategy,
        {
            provide: 'STRATEGIES',
            useFactory: (...strategies: BillingStrategy[]) => strategies,
            inject: [NationalStrategy, InternationalStrategy, FriendStrategy]
        }
    ],
    exports: [BillingContext]
})
export class BillingModule {
    constructor(
        billingContext: BillingContext,
        @Inject('STRATEGIES') strategies: BillingStrategy[]
    ) {
        strategies.forEach(strategy => billingContext.registerStrategy(strategy));
    }
}