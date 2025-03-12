import { Module } from '@nestjs/common';
import { FriendsTotalStrategy } from './friends-total.strategy';
import { NationalTotalStrategy } from './national-total.strategy';
import { InternationalTotalStrategy } from './international-total.strategy';
import { TotalizationAmountStrategy } from './totalization-amount.strategy';

@Module({
    providers: [
        FriendsTotalStrategy,
        NationalTotalStrategy,
        InternationalTotalStrategy,
        TotalizationAmountStrategy,
    ],
    exports: [
        FriendsTotalStrategy,
        NationalTotalStrategy,
        InternationalTotalStrategy,
        TotalizationAmountStrategy,
    ],
})
export class TotalizationStrategiesModule { }