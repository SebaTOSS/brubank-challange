import { Module } from '@nestjs/common';
import { FriendStrategy } from './friend.strategy';
import { NationalStrategy } from './national.strategy';
import { InternationalStrategy } from './international.strategy';

@Module({
    providers: [
        FriendStrategy,
        NationalStrategy,
        InternationalStrategy,
    ],
    exports: [
        FriendStrategy,
        NationalStrategy,
        InternationalStrategy,
    ],
})
export class BillingStrategiesModule { }