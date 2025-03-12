import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumber implements ValidatorConstraintInterface {
  validate(phoneNumber: string, args: ValidationArguments) {
    const phoneRegex = /^\+\d{1,3}\d{4,14}$/;
    
    return phoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number ($value) is not valid. It should start with a "+" followed by the country code and the number.';
  }
}