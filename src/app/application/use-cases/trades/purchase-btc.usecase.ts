import { type IRepository, type ITransactionRepository } from '@/app/infrastructure/repositories/interfaces';

import { type PurchaseBtcDto } from '../../dtos';

export class PurchaseBTCUseCase {
  constructor(
    protected readonly repository: IRepository,
  ) {}

  public async execute({ accountId, amount }: PurchaseBtcDto): Promise<PurchaseBTCResponse> {

  }

  public async getCurrency
}
