import { FriendsTotalStrategy } from '../friends-total.strategy';
import { Call } from '../../../../invoices/interfaces';

describe('FriendsTotalStrategy', () => {
    let strategy: FriendsTotalStrategy;

    beforeEach(() => {
        strategy = new FriendsTotalStrategy();
    });

    it('should have the correct type', () => {
        expect(strategy.type).toBe('FRIEND');
    });

    it('should accumulate duration for friend calls', () => {
        const friendCall: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-01',
            amount: 0,
            metadata: {
                isFriend: true,
            },
        };
        strategy.processCall(friendCall);
        expect(strategy.getResult()).toEqual(['totalFriendsSeconds', 60]);
    });

    it('should not accumulate duration for non-friend calls', () => {
        const nonFriendCall: Call = {
            destination: '+191167980952',
            duration: 120,
            timestamp: '2025-01-02',
            amount: 90,
            metadata: {
                isFriend: false,
            },
        };
        strategy.processCall(nonFriendCall);
        expect(strategy.getResult()).toEqual(['totalFriendsSeconds', 0]);
    });

    it('should accumulate multiple friend calls', () => {
        const friendCall1: Call = {
            destination: '+54911111111',
            duration: 60,
            timestamp: '2025-01-01',
            amount: 0,
            metadata: {
                isFriend: true,
            },
        };
        const friendCall2: Call = {
            destination: '+54911111112',
            duration: 30,
            timestamp: '2025-01-02',
            amount: 0,
            metadata: {
                isFriend: true,
            },
        };
        strategy.processCall(friendCall1);
        strategy.processCall(friendCall2);
        expect(strategy.getResult()).toEqual(['totalFriendsSeconds', 90]);
    });

    it('should reset total to zero', () => {
        const friendCall: Call = { destination: '+54911111111', duration: 60, timestamp: '2025-01-01', amount: 0 };
        strategy.processCall(friendCall);
        strategy.reset();
        expect(strategy.getResult()).toEqual(['totalFriendsSeconds', 0]);
    });
});