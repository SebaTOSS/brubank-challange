import { IsPhoneNumber } from '../is-phone-number.validator';
import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

describe('IsPhoneNumber', () => {
    let validator: ValidatorConstraintInterface;

    beforeEach(() => {
        validator = new IsPhoneNumber();
    });

    it('should return true for valid phone numbers', () => {
        const validPhoneNumbers = [
            '+1234567890',
            '+5491167910920',
            '+441234567890',
            '+911234567890',
        ];

        validPhoneNumbers.forEach(phoneNumber => {
            expect(validator.validate(phoneNumber, {} as ValidationArguments)).toBe(true);
        });
    });

    it('should return false for invalid phone numbers', () => {
        const invalidPhoneNumbers = [
            '1234567890',
            '+123',
            '+12345678901234567890',
            '++1234567890',
            '+123-456-7890',
        ];

        invalidPhoneNumbers.forEach(phoneNumber => {
            expect(validator.validate(phoneNumber, {} as ValidationArguments)).toBe(false);
        });
    });

    it('should return the correct default message', () => {
        const args: ValidationArguments = {
            value: '+123',
            constraints: [],
            targetName: '',
            object: {},
            property: '',
        };

        expect(validator.defaultMessage(args)).toBe('Phone number ($value) is not valid. It should start with a "+" followed by the country code and the number.');
    });
});