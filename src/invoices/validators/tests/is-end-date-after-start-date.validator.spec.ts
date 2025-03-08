import { IsEndDateAfterStartDate } from '../is-end-date-after-start-date.validator';
import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

describe('IsEndDateAfterStartDate', () => {
  let validator: ValidatorConstraintInterface;

  beforeEach(() => {
    validator = new IsEndDateAfterStartDate();
  });

  it('should return true if end date is after start date', () => {
    const args: ValidationArguments = {
      value: '2025-01-31',
      constraints: ['billingPeriodStart'],
      targetName: '',
      object: { billingPeriodStart: '2025-01-01' },
      property: '',
    };

    expect(validator.validate('2025-01-31', args)).toBe(true);
  });

  it('should return false if end date is before start date', () => {
    const args: ValidationArguments = {
      value: '2025-01-01',
      constraints: ['billingPeriodStart'],
      targetName: '',
      object: { billingPeriodStart: '2025-01-31' },
      property: '',
    };

    expect(validator.validate('2025-01-01', args)).toBe(false);
  });

  it('should return false if end date is the same as start date', () => {
    const args: ValidationArguments = {
      value: '2025-01-01',
      constraints: ['billingPeriodStart'],
      targetName: '',
      object: { billingPeriodStart: '2025-01-01' },
      property: '',
    };

    expect(validator.validate('2025-01-01', args)).toBe(true);
  });

  it('should return the correct default message', () => {
    const args: ValidationArguments = {
      value: '2025-01-01',
      constraints: ['billingPeriodStart'],
      targetName: '',
      object: { billingPeriodStart: '2025-01-31' },
      property: '',
    };

    expect(validator.defaultMessage(args)).toBe('End date ($value) should not be before start date.');
  });
});