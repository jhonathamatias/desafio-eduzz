import { Email } from '@/app/domain/value-objects/email.vo';

describe('Email Value Object', () => {
  it('should create an Email instance with a valid email', () => {
    const validEmail = 'test@example.com';
    const email = new Email(validEmail);

    expect(email.getValue()).toBe(validEmail);
  });

  it('should throw an error for an invalid email', () => {
    const invalidEmail = 'invalid-email';

    expect(() => new Email(invalidEmail)).toThrow('Invalid format');
  });

  it('should throw an error for an empty email', () => {
    const emptyEmail = '';

    expect(() => new Email(emptyEmail)).toThrow('Invalid format');
  });
});
