import { type ITransactionRepository } from '@/app/infrastructure/repositories/interfaces';

import { type GetValidAccountUseCase } from '../account/get-valid-account.usecase';

export default class GetDailyBTCTotalUseCase {
  constructor(
    protected readonly transactionRepository: ITransactionRepository,
    protected readonly getAccountValidUseCase: GetValidAccountUseCase
  ) {}

  public async execute(accountId: string): Promise<{ btcPurchaseVolume: number; btcSellVolume: number }> {
    const account = await this.getAccountValidUseCase.execute(accountId);

    return await this.transactionRepository.getDailyBitcoinSummary(account.id as string);
  }
}
