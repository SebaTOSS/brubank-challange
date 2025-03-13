import { Injectable, SetMetadata } from '@nestjs/common';

export const CALL_TYPE_METADATA = 'call-type';

export const CallTypeDecorator = () =>
    (target: Function) => {
        SetMetadata(CALL_TYPE_METADATA, true)(target);
        Injectable()(target);
    };