import { Module } from '@nestjs/common';
import { CallTypeContext } from './call-type.context';
import {
    FriendCallTypeStrategy,
    NationalCallTypeStrategy,
    InternationalCallTypeStrategy,
} from './strategies';

@Module({
  providers: [
    CallTypeContext,
    FriendCallTypeStrategy,
    NationalCallTypeStrategy,
    InternationalCallTypeStrategy,
  ],
  exports: [CallTypeContext],
})
export class TypeStrategiesModule {}