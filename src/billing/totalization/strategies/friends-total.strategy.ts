import { TotalizationStrategy } from '../interfaces';
import { TotalizationStrategyDecorator } from '../decorators/totalization-strategy.decorator';
import { Call } from '../../../invoices/interfaces';

@TotalizationStrategyDecorator()
export class FriendsTotalStrategy implements TotalizationStrategy {
    public readonly type = 'FRIEND';
    private total = 0;

    processCall(call: Call): void {
        if (call.metadata?.isFriend) {
            this.total += call.duration;
        }
    }

    getTotal(): number {
        return this.total;
    }

    reset(): void {
        this.total = 0;
    }

    getResult(): [string, number] {
        return ['totalFriendsSeconds', this.total];
    }
}