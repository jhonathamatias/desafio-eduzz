import { AlreadyExistsError } from '../errors';
import { InvalidError } from '../errors/invalid.error';
import { type Email } from '../value-objects';

export default class AccountEntity {
  constructor(
    public name: string,
    public email: Email,
    public password: string,
    public id?: string,
    public balance: number = 0
  ) {}

  public accountExists(): boolean {
    return !!this.id;
  }

  public isValid(): boolean {
    if (this.accountExists() === false) {
      throw new InvalidError('Account not found');
    }

    return true;
  }

  public canBeSaved(): boolean {
    if (this.accountExists()) {
      throw new AlreadyExistsError('Account already exists');
    }

    return true;
  }

  public calculateBalance(totalDeposit: number, totalWithdraw: number): number {
    return totalDeposit - totalWithdraw;
  }

  public deposit(amount: number): number {
    return amount;
  }

  public setBalance(totalDeposit: number, totalWithdraw: number): void {
    this.balance = this.calculateBalance(totalDeposit, totalWithdraw);
  }

  public hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  public validateWithdraw(amount: number): boolean {
    if (!this.hasSufficientBalance(amount)) {
      throw new InvalidError('Insufficient balance');
    }

    return true;
  }
}
