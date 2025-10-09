import { type MockProxy, mock } from 'jest-mock-extended';

import { TransactionDirection, TransactionType } from '@/app/application/enums/transaction.enum';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import SellBTCUseCase from '@/app/application/use-cases/trades/sell-btc.usecase';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';
import Collection from '@/app/infrastructure/repositories/collection.repository';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('SellBTCUseCase', () => {
  let sellBTCUseCase: SellBTCUseCase;
  let mockRepository: MockProxy<IRepository>;
  let mockCriteria: MockProxy<ICriteria>;
  let mockQueue: MockProxy<IQueue>;
  let mockGetBTCPriceUseCase: MockProxy<IApplicationCommand<{ buy: number; sell: number }>>;

  beforeEach(() => {
    mockRepository = mock<IRepository>();
    mockCriteria = mock<ICriteria>();
    mockQueue = mock<IQueue>();
    mockGetBTCPriceUseCase = mock<IApplicationCommand<{ buy: number; sell: number }>>();

    sellBTCUseCase = new SellBTCUseCase(mockRepository, mockCriteria, mockQueue, mockGetBTCPriceUseCase);
  });

  it('should fully liquidate investments and register the withdrawal', async () => {
    mockGetBTCPriceUseCase.execute.mockResolvedValue({ buy: 50000, sell: 49500 });

    mockRepository.matching.mockResolvedValue(
      new Collection([
        { id: 'investment1', base_amount: 0.02, price_at_buy: 48000, is_active: true },
        { id: 'investment2', base_amount: 0.01, price_at_buy: 49000, is_active: true }
      ])
    );

    // Mock transaction registration
    mockRepository.save.mockResolvedValue(true);

    await sellBTCUseCase.execute('account1', 990);

    expect(mockRepository.update).toHaveBeenCalledWith({ id: 'investment1' }, { is_active: false });
    expect(mockRepository.update).toHaveBeenCalledWith({ id: 'investment2' }, { is_active: false });

    expect(mockRepository.save).toHaveBeenCalledWith({
      account_id: 'account1',
      amount: 990,
      currency_id: expect.any(String),
      direction: TransactionDirection.DEBIT,
      type: TransactionType.WITHDRAW
    });

    // Verify email was sent
    expect(mockQueue.publish).toHaveBeenCalledWith('SEND_EMAIL', {
      accountId: 'account1',
      subject: 'Bitcoin Sale Completed',
      body: 'You sold 0.03 BTC and withdrew R$ 990.00.',
      type: 'BTC_SALE'
    });
  });
  it('should partially liquidate an investment and reinvest the residual', async () => {
    // Mock BTC price
    mockGetBTCPriceUseCase.execute.mockResolvedValue({ buy: 50000, sell: 49500 });

    // Mock investments
    mockRepository.matching.mockResolvedValue([
      { id: 'investment1', base_amount: 0.05, price_at_buy: 48000, is_active: true }
    ]);

    // Mock transaction registration
    mockRepository.save.mockResolvedValue(true);

    // Execute the use case
    await sellBTCUseCase.execute('account1', 990);

    // Verify investment was liquidated
    expect(mockRepository.update).toHaveBeenCalledWith({ id: 'investment1' }, { is_active: false });

    // Verify residual was reinvested
    expect(mockRepository.save).toHaveBeenCalledWith({
      account_id: 'account1',
      base_amount: expect.any(Number),
      price_at_buy: 48000,
      is_active: true
    });

    // Verify withdrawal was registered
    expect(mockRepository.save).toHaveBeenCalledWith({
      account_id: 'account1',
      amount: 990,
      currency_id: expect.any(String),
      direction: TransactionDirection.DEBIT,
      type: TransactionType.WITHDRAW
    });

    // Verify email was sent
    expect(mockQueue.publish).toHaveBeenCalledWith('SEND_EMAIL', {
      accountId: 'account1',
      subject: 'Bitcoin Sale Completed',
      body: 'You sold 0.02 BTC and withdrew R$ 990.00.',
      type: 'BTC_SALE'
    });
  });
});
