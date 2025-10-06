import { InvalidError } from '../errors';

export default class DepositEntity {
  constructor(public readonly amount: number) {}

  public isNegative(): boolean {
    return this.amount < 0;
  }

  public isZero(): boolean {
    return this.amount === 0;
  }

  public validate(): boolean {
    if (this.isNegative()) {
      throw new InvalidError('Its not possible to deposit negative values');
    }

    if (this.isZero()) {
      throw new InvalidError('Its not possible to deposit zero value');
    }

    return true;
  }
}
