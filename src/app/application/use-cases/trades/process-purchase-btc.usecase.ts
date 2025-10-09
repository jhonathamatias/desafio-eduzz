import { TransactionType } from '@prisma/client';

import { type AccountEntity } from '@/app/domain/entities';
import Bitcoin from '@/app/domain/entities/bitcoin.entity';
import { Queues } from '@/app/infrastructure/queue/enums/queue.enum';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';
import { type IBitcoinRepository } from '@/app/infrastructure/repositories/interfaces/bitcoin.repository.interface';

import { TransactionDirection } from '../../enums/transaction.enum';
import type IApplicationCommand from '../interfaces/application-command.interface';

/**
 * TODO: Refatorar esse use case, ele está fazendo muitas coisas.
 * TODO: Fazer o envio de email via worker.
 */
export class ProcessPurchaseBTCUseCase {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly getValidAccountUseCase: IApplicationCommand<AccountEntity>,
    protected readonly bitcoinRepository: IBitcoinRepository,
    protected readonly queue: IQueue
  ) {}

  public async execute({ accountId, amount }: { accountId: string; amount: number }): Promise<void> {
    const account = await this.getValidAccountUseCase.execute(accountId);

    const { sell: btcPrice } = await this.bitcoinRepository.getPrice();

    const bitcoin = new Bitcoin(btcPrice);
    const btcAmount = bitcoin.calculateAmount(amount);

    const [currencyBRL, currencyBTC] = await Promise.all([
      await this.getCurrencyIdByCode('BRL'),
      await this.getCurrencyIdByCode('BTC')
    ]);

    await this.withdraw(account.id as string, amount, currencyBRL);
    await this.buyBitcoin(account.id as string, btcAmount, currencyBTC);

    await this.saveInvestment({
      accountId: account.id as string,
      btcAmount,
      amount,
      price: btcPrice,
      quoteCurrencyId: currencyBRL,
      baseCurrencyId: currencyBTC,
      transactionId: (await this.repository.getInsertedLastId()) as string
    });

    this.queue.publish(Queues.PURCHASE_NOTIFICATION, {
      accountId: account.id,
      email: account.email.getValue(),
      name: account.name,
      amount,
      btcAmount,
      btcPrice
    });
  }

  protected async withdraw(accountId: string, amount: number, currencyId: string): Promise<void> {
    this.repository.setCollection('transaction');

    await this.repository.save({
      account_id: accountId,
      amount,
      currency_id: currencyId,
      direction: TransactionDirection.DEBIT,
      type: TransactionType.WITHDRAW
    });
  }

  protected async buyBitcoin(accountId: string, btcAmount: number, currencyId: string): Promise<void> {
    this.repository.setCollection('transaction');

    await this.repository.save({
      account_id: accountId,
      amount: btcAmount,
      currency_id: currencyId,
      direction: TransactionDirection.CREDIT,
      type: TransactionType.BUY
    });
  }

  protected async saveInvestment({
    accountId,
    btcAmount,
    amount,
    price,
    quoteCurrencyId,
    baseCurrencyId,
    transactionId
  }: {
    accountId: string;
    btcAmount: number;
    amount: number;
    price: number;
    quoteCurrencyId: string;
    baseCurrencyId: string;
    transactionId: string;
  }): Promise<void> {
    this.repository.setCollection('investment');

    await this.repository.save({
      account_id: accountId,
      base_amount: btcAmount,
      quote_amount: amount,
      base_currency_id: baseCurrencyId,
      quote_currency_id: quoteCurrencyId,
      transaction_id: transactionId,
      price_at_buy: price,
      is_active: true
    });
  }

  protected async getCurrencyIdByCode(code: string): Promise<string> {
    this.repository.setCollection('currency');

    this.criteria.clear();
    this.criteria.equal('code', code);

    const currency = (await this.repository.matching(this.criteria)).first() as { id: string };

    return currency.id as string;
  }
}
