import * as moment from 'moment';

export function extractCountryCode(phoneNumber: string): string {
    const countryCodeMatch = phoneNumber.match(/^\+(\d{1,2})/);
    if (!countryCodeMatch) {
        throw new Error('Invalid phone number format');
    }
    return countryCodeMatch[1];
}

export function isNationalCall(origin: string, destination: string): boolean {
    const originCountry = extractCountryCode(origin);
    const destCountry = extractCountryCode(destination);

    return originCountry === destCountry;
}

export function isInternationalCall(origin: string, destination: string): boolean {
    const originCountry = extractCountryCode(origin);
    const destCountry = extractCountryCode(destination);

    return originCountry !== destCountry;
}

export function isBetweenDates(date: string, start: Date, end: Date): boolean {
    const momentDate = moment(date);
    const momentStart = moment(start);
    const momentEnd = moment(end);
    
    return momentDate.isBetween(momentStart, momentEnd, undefined, '[]');
}

export function createDate(date: string): any {
    return moment(date);
}