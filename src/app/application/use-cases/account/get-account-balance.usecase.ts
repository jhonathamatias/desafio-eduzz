import { type AccountEntity } from '@/app/domain/entities';
import { type ITransactionRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export class GetAccountBalanceUseCase {
  constructor(
    protected readonly transactionRepository: ITransactionRepository,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>
  ) {}

  public async execute(accountId: string): Promise<number> {
    const account = await this.getValidAccountUseCase.execute(accountId);

    return parseFloat(account.balance.toFixed(2));
  }
}
