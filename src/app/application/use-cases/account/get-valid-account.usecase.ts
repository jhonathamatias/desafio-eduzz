import { type GetAccountDto } from '@/app/application/dtos';
import { NotFoundError } from '@/app/application/errors';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import {
  type ITransactionRepository,
  type IRepository,
  type ICriteria
} from '@/app/infrastructure/repositories/interfaces';

import { TransactionDirection, TransactionType } from '../../enums/transaction.enum';

export class GetValidAccountUseCase {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly transactionRepository: ITransactionRepository
  ) {}

  public async execute(accountId: string): Promise<AccountEntity> {
    this.repository.setCollection('accounts');
    const account = (await this.repository.getById(accountId)) as (GetAccountDto & { password: string }) | null;

    if (!account) {
      throw new NotFoundError('Account does not exist.');
    }

    const currencyId = (await this.getCurrencyIdByCode('BRL')) as string;

    const [totalDeposit, totalWithdraw] = await Promise.all([
      this.transactionRepository.getTotalTransaction(
        accountId,
        currencyId,
        TransactionDirection.CREDIT,
        TransactionType.DEPOSIT
      ),
      this.transactionRepository.getTotalTransaction(
        accountId,
        currencyId,
        TransactionDirection.DEBIT,
        TransactionType.WITHDRAW
      )
    ]);

    const accountEntity = new AccountEntity(account.name, new Email(account.email), account.password, account.id);

    accountEntity.setBalance(totalDeposit, totalWithdraw);

    accountEntity.isValid();

    return accountEntity;
  }

  protected async getCurrencyIdByCode(code: string): Promise<string> {
    this.repository.setCollection('currency');

    this.criteria.clear();
    this.criteria.equal('code', code);

    const currency = (await this.repository.matching(this.criteria)).first() as { id: string };
    return currency.id as string;
  }
}
