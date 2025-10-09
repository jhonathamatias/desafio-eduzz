import { type AccountEntity } from '@/app/domain/entities';
import { Queues } from '@/app/infrastructure/queue/enums/queue.enum';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';

import { type PurchaseBtcDto } from '../../dtos';
import type IApplicationCommand from '../interfaces/application-command.interface';

export default class PurchaseBTCUseCase {
  constructor(
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>,
    protected readonly queue: IQueue
  ) {}

  public async execute({ accountId, amount }: PurchaseBtcDto): Promise<void> {
    const account = await this.getValidAccountUseCase.execute(accountId);

    account.validateWithdraw(amount);

    await this.queue.publish(Queues.BTC_PURCHASE, {
      accountId: account.id,
      amount
    });
  }
}
