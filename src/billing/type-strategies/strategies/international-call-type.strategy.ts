import { CallTypeStrategy, CallData, CallMetadata } from '../interfaces';
import { CallTypeDecorator } from '../decorators/call-type.decorator';
import { isInternationalCall } from '../../../utils/utils';

@CallTypeDecorator()
export class InternationalCallTypeStrategy implements CallTypeStrategy {
    processCall({ origin, destination }: CallData): CallMetadata {
        return { isInternational: isInternationalCall(origin, destination) };
    }
}