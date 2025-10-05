import { AlreadyExistsError } from '../errors';
import { InvalidError } from '../errors/invalid.error';
import { type Email } from '../value-objects';

export default class AccountEntity {
  constructor(
    public name: string,
    public email: Email,
    public password: string,
    public id?: string
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
}
