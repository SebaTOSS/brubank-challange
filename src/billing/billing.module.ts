import { Module } from "@nestjs/common";
import { BillingContext } from "./billing-context";
import { TotalizationModule } from './totalization/totalization.module';
import { BillingStrategiesModule } from './strategies/strategies.module';
import { TypeStrategiesModule } from "./type-strategies/type-strategies.module";

@Module({
    imports: [
        BillingStrategiesModule,
        TotalizationModule,
        TypeStrategiesModule,
    ],
    providers: [BillingContext],
    exports: [
        BillingContext,
        TotalizationModule,
        TypeStrategiesModule,
    ],
})
export class BillingModule { }