import { type PrismaClient, Prisma } from '@prisma/client';

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

  public async getDailyBitcoinSummary(
    accountId: string
  ): Promise<{ btcPurchaseVolume: number; btcSellVolume: number }> {
    console.log(accountId);

    const result = await this.prisma.$queryRaw<{ btcPurchaseVolume: bigint | null; btcSellVolume: bigint | null }[]>(
      Prisma.sql`SELECT 
        SUM(CASE WHEN type = 'BUY' AND direction = 'CREDIT' THEN amount ELSE 0 END) AS "btcPurchaseVolume",
        SUM(CASE WHEN type = 'SELL' AND direction = 'DEBIT' THEN amount ELSE 0 END) AS "btcSellVolume"
      FROM transactions
      WHERE account_id = ${accountId}::uuid
        AND currency_id = (SELECT id FROM currencies WHERE code = 'BTC')
        AND type IN ('BUY', 'SELL')
        AND direction IN ('CREDIT', 'DEBIT')
        AND created_at >= CURRENT_DATE
        AND created_at < CURRENT_DATE + INTERVAL '1 day';`
    );

    const summary = result[0] || { btcPurchaseVolume: 0, btcSellVolume: 0 };

    return {
      btcPurchaseVolume: Number(summary.btcPurchaseVolume || 0),
      btcSellVolume: Number(summary.btcSellVolume || 0)
    };
  }
}
