import * as moment from 'moment';
import {
    extractCountryCode,
    isNationalCall,
    isInternationalCall,
    isBetweenDates,
    createDate,
} from '../utils';

describe('Utils Functions', () => {
    describe('extractCountryCode', () => {
        it('should extract country code from valid phone number', () => {
            expect(extractCountryCode('+5491167910920')).toBe('54');
            expect(extractCountryCode('+12025550123')).toBe('12');
            expect(extractCountryCode('+447911123456')).toBe('44');
        });

        it('should throw error for invalid phone number format', () => {
            expect(() => extractCountryCode('5491167910920')).toThrow('Invalid phone number format');
            expect(() => extractCountryCode('+')).toThrow('Invalid phone number format');
            expect(() => extractCountryCode('abc')).toThrow('Invalid phone number format');
            expect(() => extractCountryCode('')).toThrow('Invalid phone number format');
        });
    });

    describe('isNationalCall', () => {
        it('should return true for calls within the same country', () => {
            expect(isNationalCall('+5491167910920', '+5491111111111')).toBe(true);
            expect(isNationalCall('+12025550123', '+12025550124')).toBe(true);
            expect(isNationalCall('+447911123456', '+447911123457')).toBe(true);
        });

        it('should return false for calls to different countries', () => {
            expect(isNationalCall('+5491167910920', '+12025550123')).toBe(false);
            expect(isNationalCall('+12025550123', '+447911123456')).toBe(false);
            expect(isNationalCall('+447911123456', '+5491111111111')).toBe(false);
        });

        it('should throw error if phone numbers are invalid', () => {
            expect(() => isNationalCall('5491167910920', '+5491111111111')).toThrow('Invalid phone number format');
            expect(() => isNationalCall('+5491167910920', '12025550123')).toThrow('Invalid phone number format');
        });
    });

    describe('isInternationalCall', () => {
        it('should return true for calls to different countries', () => {
            expect(isInternationalCall('+5491167910920', '+12025550123')).toBe(true);
            expect(isInternationalCall('+12025550123', '+447911123456')).toBe(true);
            expect(isInternationalCall('+447911123456', '+5491111111111')).toBe(true);
        });

        it('should return false for calls within the same country', () => {
            expect(isInternationalCall('+5491167910920', '+5491111111111')).toBe(false);
            expect(isInternationalCall('+12025550123', '+12025550124')).toBe(false);
            expect(isInternationalCall('+447911123456', '+447911123457')).toBe(false);
        });

        it('should throw error if phone numbers are invalid', () => {
            expect(() => isInternationalCall('5491167910920', '+5491111111111')).toThrow('Invalid phone number format');
            expect(() => isInternationalCall('+5491167910920', '12025550123')).toThrow('Invalid phone number format');
        });
    });

    describe('isBetweenDates', () => {
        let startDate: Date;
        let endDate: Date;

        beforeEach(() => {
            startDate = new Date('2025-01-01T00:00:00Z');
            endDate = new Date('2025-01-31T23:59:59Z');
        });

        it('should return true for dates within range (inclusive)', () => {
            expect(isBetweenDates('2025-01-15T10:00:00Z', startDate, endDate)).toBe(true);
            expect(isBetweenDates('2025-01-01T00:00:00Z', startDate, endDate)).toBe(true);
            expect(isBetweenDates('2025-01-31T23:59:59Z', startDate, endDate)).toBe(true);
        });

        it('should return false for dates outside range', () => {
            expect(isBetweenDates('2024-12-31T23:59:59Z', startDate, endDate)).toBe(false);
            expect(isBetweenDates('2025-02-01T00:00:00Z', startDate, endDate)).toBe(false);
        });

        it('should handle different date formats', () => {
            expect(isBetweenDates('2025-01-15', startDate, endDate)).toBe(true);
            expect(isBetweenDates('2025-01-15 10:00:00', startDate, endDate)).toBe(true);
        });

        it('should not throw error for invalid date string but return false', () => {
            const result = isBetweenDates('invalid-date', startDate, endDate);
            expect(result).toBe(false);
        });
    });

    describe('createDate', () => {
        it('should create a moment object from valid date string', () => {
            const date = createDate('2025-01-15T10:00:00Z');
            expect(moment.isMoment(date)).toBe(true);
            expect(date.toISOString()).toBe('2025-01-15T10:00:00.000Z');
        });

        it('should handle different date formats', () => {
            const date1 = createDate('2025-01-15');
            expect(date1.format('YYYY-MM-DD')).toBe('2025-01-15');

            const date2 = createDate('2025-01-15 10:00:00');
            expect(date2.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-01-15 10:00:00');
        });

        it('should return invalid moment object for invalid date string', () => {
            const date = createDate('invalid-date');
            expect(moment.isMoment(date)).toBe(true);
            expect(date.isValid()).toBe(false);
        });
    });
});