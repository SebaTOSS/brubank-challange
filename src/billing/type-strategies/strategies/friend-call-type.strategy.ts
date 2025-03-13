import { CallTypeStrategy, CallData, CallMetadata } from '../interfaces';
import { CallTypeDecorator } from '../decorators/call-type.decorator';

@CallTypeDecorator()
export class FriendCallTypeStrategy implements CallTypeStrategy {
    private friendCallCounts: Record<string, number> = {};

    processCall({ destination, user }: CallData): CallMetadata {
        const isFriend = user?.friends?.includes(destination) || false;
        if (isFriend) {
            this.friendCallCounts[destination] = (this.friendCallCounts[destination] || 0) + 1;
        }
        
        return {
            isFriend,
            callCount: this.friendCallCounts[destination] || 0,
        };
    }

    initialize(): void {
        this.friendCallCounts = {};
    }
}