import { type DepositDto } from '@/app/application/dtos';
import { type AccountEntity } from '@/app/domain/entities';
import { DepositEntity } from '@/app/domain/entities';
import { Queues } from '@/app/infrastructure/queue/enums/queue.enum';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

import { TransactionDirection, TransactionType } from '../../enums/transaction.enum';
import type IApplicationCommand from '../interfaces/application-command.interface';

export default class DepositToAccountUseCase implements IApplicationCommand {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>,
    protected readonly queue: IQueue
  ) {}

  public async execute({ accountId, amount }: DepositDto): Promise<{ balance: number }> {
    const accountEntity = await this.getValidAccountUseCase.execute(accountId);

    const deposit = new DepositEntity(amount);

    deposit.validate();

    const currencyId = await this.getCurrencyIdByCode('BRL');

    await this.saveDeposit(accountEntity.id as string, currencyId as string, deposit.amount);

    await this.queue.publish(Queues.DEPOSIT_NOTIFICATION, {
      accountId: accountEntity.id,
      email: accountEntity.email.getValue(),
      name: accountEntity.name,
      amount: deposit.amount,
      currencyId
    });

    return { balance: accountEntity.balance };
  }

  protected async saveDeposit(accountId: string, currencyId: string, amount: number): Promise<void> {
    this.repository.setCollection('transaction');

    await this.repository.save({
      account_id: accountId,
      amount,
      currency_id: currencyId,
      direction: TransactionDirection.CREDIT,
      type: TransactionType.DEPOSIT
    });
  }

  protected async getCurrencyIdByCode(code: string): Promise<string | null> {
    this.repository.setCollection('currency');

    this.criteria.clear();
    this.criteria.equal('code', code);

    const currency = (await this.repository.matching(this.criteria)).first() as { id: string };

    return currency.id as string;
  }
}
