import { type PrismaClient } from '@prisma/client';

import { type TransactionDirection, type TransactionType } from '@/app/application/enums/transaction.enum';

import { type ITransactionRepository } from '../interfaces';

export class TransactionPrismaRepository implements ITransactionRepository {
  constructor(protected prisma: PrismaClient) {}

  public async getTotalTransaction(
    accountId: string,
    currencyId: string,
    direction: TransactionDirection,
    type: TransactionType
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        account_id: accountId,
        currency_id: currencyId,
        direction,
        type
      }
    });
    return result._sum?.amount?.toNumber() || 0;
  }
}
