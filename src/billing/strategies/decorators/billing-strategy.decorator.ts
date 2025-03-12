import { Injectable, SetMetadata } from '@nestjs/common';

export const BILLING_STRATEGY_METADATA = 'billing-strategy';

export const BillingStrategyDecorator = () =>
  (target: Function) => {
    SetMetadata(BILLING_STRATEGY_METADATA, true)(target);
    Injectable()(target);
  };