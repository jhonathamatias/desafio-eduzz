import bcrypt from 'bcrypt';

import { type CreateAccountDto, type GetAccountDto } from '@/app/application/dtos';
import { NotFoundError } from '@/app/application/errors';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

type AccountType = {
  id: string;
  name: string;
  email: string;
};

export default class CreateAccountUseCase implements IApplicationCommand {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria
  ) {}

  public async execute({ name, email, password }: CreateAccountDto): Promise<GetAccountDto> {
    const existingAccount = await this.emailExists(email);
    const hashedPassword = await this.hashPassword(password);

    const account = new AccountEntity(name, new Email(email), hashedPassword, existingAccount?.id);

    account.canBeSaved();

    const accountId = await this.saveAccount(account);
    const createdAccount = await this.getAccountCreated(accountId);

    if (!createdAccount) {
      throw new NotFoundError('Account creation failed');
    }

    return createdAccount;
  }

  protected async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  protected async saveAccount(account: AccountEntity): Promise<string> {
    this.repository.setCollection('account');

    await this.repository.save({
      name: account.name,
      email: account.email.getValue(),
      password: account.password
    });

    return await this.repository.getInsertedLastId();
  }

  protected async getAccountCreated(id: string): Promise<GetAccountDto | null> {
    this.repository.setCollection('account');

    const account = (await this.repository.getById(id)) as AccountType | null;

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      name: account.name,
      email: account.email
    };
  }

  protected async emailExists(email: string): Promise<AccountType | null> {
    this.repository.setCollection('account');

    this.criteria.clear();
    this.criteria.equal('email', email);

    const result = await this.repository.matching(this.criteria);
    return (await result.first()) as AccountType;
  }
}
