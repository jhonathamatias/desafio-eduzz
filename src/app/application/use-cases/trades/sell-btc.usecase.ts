import { TransactionDirection, TransactionType } from '@/app/application/enums/transaction.enum';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';
import { type ICollection, type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export default class SellBTCUseCase {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly queue: IQueue,
    protected readonly getBTCPriceUseCase: IApplicationCommand<{ buy: number; sell: number }>
  ) {}

  public async execute(accountId: string, amountToSellBRL: number): Promise<void> {
    const btcPrice = await this.getBTCPriceUseCase.execute();
    const investments = await this.getInvestments(accountId);

    let remainingAmountBRL = amountToSellBRL;
    let totalWithdrawnBRL = 0;
    let totalSoldBTC = 0;

    for (const investment of investments) {
      if (remainingAmountBRL <= 0) break;

      const btcAmount = investment.base_amount;
      const quoteAmountBRL = btcAmount * btcPrice.sell;

      if (remainingAmountBRL >= quoteAmountBRL) {
        await this.liquidateInvestment(investment.id);
        await this.registerSellBTC(accountId, btcAmount, TransactionType.SELL);
        totalWithdrawnBRL += quoteAmountBRL;
        totalSoldBTC += btcAmount;
        remainingAmountBRL -= quoteAmountBRL;
      } else {
        const btcToSell = remainingAmountBRL / btcPrice.sell;
        const btcResidual = btcAmount - btcToSell;

        await this.liquidateInvestment(investment.id);
        await this.registerSellBTC(accountId, btcToSell, TransactionType.SELL);
        await this.reinvestResidual(accountId, btcResidual, investment.price_at_buy);

        totalWithdrawnBRL += remainingAmountBRL;
        totalSoldBTC += btcToSell;
        remainingAmountBRL = 0;
      }
    }

    if (totalWithdrawnBRL > 0) {
      await this.registerWithdrawalBRL(accountId, totalWithdrawnBRL);
    }
  }

  private async getInvestments(accountId: string): Promise<ICollection<object>> {
    this.repository.setCollection('investment');

    this.criteria.clear();
    this.criteria.equal('account_id', accountId);
    this.criteria.equal('is_active', true);
    this.criteria.orderBy('created_at', 'asc');

    return await this.repository.matching(this.criteria);
  }

  private async liquidateInvestment(investmentId: string): Promise<void> {
    this.repository.setCollection('investment');
    await this.repository.update({ id: investmentId }, { is_active: false });
  }

  private async reinvestResidual(accountId: string, btcAmount: number, priceAtBuy: number): Promise<void> {
    this.repository.setCollection('investment');
    await this.repository.save({
      account_id: accountId,
      base_amount: btcAmount,
      price_at_buy: priceAtBuy,
      is_active: true
    });

    await this.registerSellBTC(accountId, btcAmount, TransactionType.REINVESTMENT);
  }

  private async registerWithdrawalBRL(accountId: string, amount: number): Promise<void> {
    const currencyId = await this.getCurrencyIdByCode('BRL');
    this.repository.setCollection('transaction');
    await this.repository.save({
      account_id: accountId,
      amount,
      currency_id: currencyId,
      direction: TransactionDirection.CREDIT,
      type: TransactionType.WITHDRAW
    });
  }

  private async registerSellBTC(accountId: string, amount: number, type: TransactionType): Promise<void> {
    const currencyId = await this.getCurrencyIdByCode('BTC');
    this.repository.setCollection('transaction');
    await this.repository.save({
      account_id: accountId,
      amount,
      currency_id: currencyId,
      direction: TransactionDirection.DEBIT,
      type
    });
  }

  private async getCurrencyIdByCode(code: string): Promise<string> {
    this.repository.setCollection('currency');
    this.criteria.clear();
    this.criteria.equal('code', code);

    const [currency] = await this.repository.matching(this.criteria);
    return (currency as { id: string })?.id ?? '';
  }
}
