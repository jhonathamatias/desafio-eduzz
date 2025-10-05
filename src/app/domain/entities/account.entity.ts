import { AlreadyExistsError } from '../errors';
import { type Email } from '../value-objects/email.vo';

export default class AccountEntity {
  constructor(
    public name: string,
    public email: Email,
    public password: string,
    public id?: string
  ) {}

  public alreadyExists(): boolean {
    if (this.id) {
      throw new AlreadyExistsError('Account already exists');
    }

    return false;
  }

  public canBeSaved(): boolean {
    this.alreadyExists();
    return true;
  }
}
