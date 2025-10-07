import { type DepositDto } from '@/app/application/dtos';
import { type AccountEntity } from '@/app/domain/entities';
import { DepositEntity } from '@/app/domain/entities';
import {
  type ICriteria,
  type IDepositRepository,
  type IRepository
} from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export default class DepositToAccountUseCase implements IApplicationCommand {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly depositRepository: IDepositRepository,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>
  ) {}

  public async execute({ accountId, amount }: DepositDto): Promise<{ balance: number }> {
    const accountEntity = await this.getValidAccountUseCase.execute(accountId);

    const deposit = new DepositEntity(amount);

    deposit.validate();

    const currencyId = await this.getCurrencyIdByCode('BRL');

    await this.saveDeposit(accountEntity.id as string, currencyId as string, deposit.amount);
    const balance = await this.getAccountBalance(accountEntity.id as string, currencyId as string);

    return { balance };
  }

  protected async saveDeposit(accountId: string, currencyId: string, amount: number): Promise<void> {
    this.repository.setCollection('deposits');

    await this.repository.save({
      account_id: accountId,
      amount,
      currency_id: currencyId
    });
  }

  protected async getAccountBalance(accountId: string, currencyId: string): Promise<number> {
    return await this.depositRepository.sumAmounts(accountId, currencyId);
  }

  protected async getCurrencyIdByCode(code: string): Promise<string | null> {
    this.repository.setCollection('currency');

    this.criteria.clear();
    this.criteria.equal('code', code);

    const currency = (await this.repository.matching(this.criteria)).first() as { id: string };

    return currency.id as string;
  }
}
