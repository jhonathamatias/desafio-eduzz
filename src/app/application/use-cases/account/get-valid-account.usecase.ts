import { type GetAccountDto } from '@/app/application/dtos';
import { NotFoundError } from '@/app/application/errors';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import { type IRepository } from '@/app/infrastructure/repositories/interfaces';

export class GetValidAccountUseCase {
  constructor(private readonly repository: IRepository) {}

  public async execute(accountId: string): Promise<AccountEntity> {
    const account = (await this.repository.getById(accountId)) as (GetAccountDto & { password: string }) | null;

    if (!account) {
      throw new NotFoundError('Account does not exist.');
    }

    const accountEntity = new AccountEntity(account.name, new Email(account.email), account.password, account.id);

    accountEntity.isValid();

    return accountEntity;
  }
}
