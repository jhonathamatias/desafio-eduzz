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
        SUM(CASE WHEN t.type = 'BUY' AND t.direction = 'CREDIT' THEN t.amount ELSE 0 END) AS "btcPurchaseVolume",
        SUM(CASE WHEN t.type = 'SELL' AND t.direction = 'DEBIT' THEN t.amount ELSE 0 END) AS "btcSellVolume"
      FROM transactions t
      INNER JOIN investments i ON t.id = i.transaction_id
      WHERE t.account_id = ${accountId}::uuid
        AND t.currency_id = (SELECT id FROM currencies WHERE code = 'BTC')
        AND i.is_active = TRUE
        AND t.type IN ('BUY', 'SELL')
        AND t.direction IN ('CREDIT', 'DEBIT')
        AND t.created_at >= CURRENT_DATE
        AND t.created_at < CURRENT_DATE + INTERVAL '1 day';`
    );

    const summary = result[0] || { btcPurchaseVolume: 0, btcSellVolume: 0 };

    return {
      btcPurchaseVolume: Number(summary.btcPurchaseVolume || 0),
      btcSellVolume: Number(summary.btcSellVolume || 0)
    };
  }

  public async getStatement(accountId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    const today = new Date();
    const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));

    const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : new Date(ninetyDaysAgo.setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : new Date();

    const transactions = await this.prisma.transaction.findMany({
      where: {
        account_id: accountId,
        created_at: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      include: { currency: true, investment: true }
    });

    return transactions.map(transaction => ({
      id: transaction.id,
      type: String(transaction.type).toLocaleLowerCase(),
      amount: Number(transaction.amount),
      currency: transaction.currency.code,
      quote: transaction.investment?.quote_amount ? Number(transaction.investment.quote_amount) : null,
      createdAt: transaction.created_at,
      priceAtBuy: transaction.investment?.price_at_buy ? Number(transaction.investment.price_at_buy) : null
    }));
  }
}
