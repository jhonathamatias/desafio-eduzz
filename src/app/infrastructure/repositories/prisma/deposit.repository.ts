import { type PrismaClient } from '@prisma/client';

import { type IDepositRepository } from '../interfaces';

export class DepositRepository implements IDepositRepository {
  constructor(protected prisma: PrismaClient) {}

  public async sumAmountsByAccountId(accountId: string): Promise<number> {
    const result = await this.prisma.deposit.aggregate({
      _sum: {
        amount: true
      },
      where: {
        accountId
      }
    });

    return result._sum.amount || 0;
  }
}
