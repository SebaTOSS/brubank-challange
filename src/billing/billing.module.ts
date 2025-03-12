import { Module } from "@nestjs/common";
import { BillingContext } from "./billing-context";
import { TotalizationModule } from './totalization/totalization.module';
import { BillingStrategiesModule } from './strategies/strategies.module';

@Module({
    imports: [BillingStrategiesModule, TotalizationModule],
    providers: [BillingContext],
    exports: [BillingContext, TotalizationModule]
})
export class BillingModule { }