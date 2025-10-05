import bcrypt from 'bcrypt';

import { type CreateAccountDto, type GetAccountDto } from '@/app/application/dtos/account.dto';
import AccountEntity from '@/app/domain/entities/account.entity';
import { Email } from '@/app/domain/value-objects';
import { type IRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

type AccountType = {
  id: string;
  name: string;
  email: string;
};

export default class CreateAccountUseCase implements IApplicationCommand {
  constructor(protected repository: IRepository) {}

  public async execute({ name, email, password }: CreateAccountDto): Promise<GetAccountDto> {
    const hashedPassword = await this.hashPassword(password);

    const account = new AccountEntity(name, new Email(email), hashedPassword);

    account.canBeSaved();

    const accountId = await this.saveAccount(account);
    const createdAccount = await this.getAccount(accountId);

    if (!createdAccount) {
      throw new Error('Account creation failed');
    }

    return createdAccount;
  }

  protected async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  protected async saveAccount(account: AccountEntity): Promise<string> {
    this.repository.setCollection('accounts');

    await this.repository.save({
      name: account.name,
      email: account.email.getValue(),
      password: account.password
    });

    return await this.repository.getInsertedLastId();
  }

  protected async getAccount(id: string): Promise<GetAccountDto | null> {
    this.repository.setCollection('accounts');

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
}
