import { type AccountEntity } from '@/app/domain/entities';
import { type IDepositRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export class GetAccountBalanceUseCase {
  constructor(
    protected readonly depositRepository: IDepositRepository,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>
  ) {}

  public async execute(accountId: string, currencyId: string): Promise<number> {
    const account = await this.getValidAccountUseCase.execute(accountId);

    return await this.depositRepository.sumAmounts(account.id as string, currencyId);
  }
}
