import { type DepositDto } from '@/app/application/dtos';
import { type AccountEntity } from '@/app/domain/entities';
import { DepositEntity } from '@/app/domain/entities';
import { type IDepositRepository, type IRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export default class DepositToAccountUseCase implements IApplicationCommand {
  constructor(
    private readonly repository: IRepository,
    private readonly depositRepository: IDepositRepository,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>
  ) {}

  public async execute({ accountId, amount }: DepositDto): Promise<{ balance: number }> {
    const accountEntity = await this.getValidAccountUseCase.execute(accountId);

    const deposit = new DepositEntity(amount);

    deposit.validate();

    await this.saveDeposit(accountEntity.id as string, deposit.amount);

    return { balance: await this.getAccountBalance(accountEntity.id as string) };
  }

  protected async saveDeposit(accountId: string, amount: number): Promise<void> {
    this.repository.setCollection('deposits');

    await this.repository.save({
      accountId,
      amount
    });
  }

  protected async getAccountBalance(accountId: string): Promise<number> {
    return await this.depositRepository.sumAmountsByAccountId(accountId);
  }
}
