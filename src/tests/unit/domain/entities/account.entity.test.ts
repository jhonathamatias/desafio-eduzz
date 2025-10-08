import AccountEntity from '@/app/domain/entities/account.entity';
import { AlreadyExistsError, InvalidError } from '@/app/domain/errors';
import { Email } from '@/app/domain/value-objects';

describe('AccountEntity', () => {
  it('should create an account entity with valid properties', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123');

    expect(account.name).toBe('John Doe');
    expect(account.email).toBe(email);
    expect(account.password).toBe('password123');
    expect(account.id).toBeUndefined();
  });

  it('should throw AlreadyExistsError if account already exists', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123', '123');

    expect(account.accountExists()).toBe(true);
  });

  it('should return false if account does not exist', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123');

    expect(account.accountExists()).toBe(false);
  });

  it('should throw InvalidError when checking validity of a non-existing account', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123');

    expect(() => account.isValid()).toThrow(InvalidError);
  });

  it('should return true if account can be saved', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123');

    expect(account.canBeSaved()).toBe(true);
  });

  it('should throw AlreadyExistsError when trying to save an existing account', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123', '123');

    expect(() => account.canBeSaved()).toThrow(AlreadyExistsError);
    expect(() => account.canBeSaved()).toThrow('Account already exists');
  });

  it('should correctly calculate the balance', () => {
    const email = new Email('test@example.com');
    const account = new AccountEntity('John Doe', email, 'password123', '123');

    const totalDeposit = 1000;
    const totalWithdraw = 400;

    const balance = account.calculateBalance(totalDeposit, totalWithdraw);

    expect(balance).toBe(600);
  });
});
