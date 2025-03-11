import { Injectable, SetMetadata } from '@nestjs/common';

export const TOTALIZATION_STRATEGY_METADATA = 'totalization-strategy';

export const TotalizationStrategyDecorator = () =>
    (target: Function) => {
        SetMetadata(TOTALIZATION_STRATEGY_METADATA, true)(target);
        Injectable()(target);
    };