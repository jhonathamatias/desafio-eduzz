import DepositEntity from '@/app/domain/entities/deposit.entity';
import { InvalidError } from '@/app/domain/errors';

describe('DepositEntity', () => {
  it('should create a DepositEntity instance with a valid amount', () => {
    const deposit = new DepositEntity(100);
    expect(deposit.amount).toBe(100);
  });

  it('should return true for isNegative when the amount is negative', () => {
    const deposit = new DepositEntity(-50);
    expect(deposit.isNegative()).toBe(true);
  });

  it('should return false for isNegative when the amount is positive', () => {
    const deposit = new DepositEntity(50);
    expect(deposit.isNegative()).toBe(false);
  });

  it('should throw an InvalidError when validate is called with a negative amount', () => {
    const deposit = new DepositEntity(-50);
    expect(() => deposit.validate()).toThrow(InvalidError);
    expect(() => deposit.validate()).toThrow('Its not possible to deposit negative values');
  });

  it('should return true when validate is called with a positive amount', () => {
    const deposit = new DepositEntity(50);
    expect(deposit.validate()).toBe(true);
  });
});
