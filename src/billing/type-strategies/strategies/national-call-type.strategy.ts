import { CallTypeStrategy, CallData, CallMetadata } from '../interfaces';
import { CallTypeDecorator } from '../decorators/call-type.decorator';
import { isNationalCall } from '../../../utils/utils';

@CallTypeDecorator()
export class NationalCallTypeStrategy implements CallTypeStrategy {
    processCall({ origin, destination }: CallData): CallMetadata {
        return { isNational: isNationalCall(origin, destination) };
    }
}