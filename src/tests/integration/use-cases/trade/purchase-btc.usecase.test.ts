import { mock } from 'jest-mock-extended';

import { type PurchaseBtcDto } from '@/app/application/dtos';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import PurchaseBTCUseCase from '@/app/application/use-cases/trades/purchase-btc.usecase';
import { AccountEntity } from '@/app/domain/entities';
import { InvalidError } from '@/app/domain/errors';
import { Email } from '@/app/domain/value-objects';
import { Queues } from '@/app/infrastructure/queue/enums/queue.enum';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';

describe('PurchaseBTCUseCase', () => {
  let getValidAccountUseCaseMock: IApplicationCommand<AccountEntity>;
  let queueMock: IQueue;
  let purchaseBTCUseCase: PurchaseBTCUseCase;

  beforeEach(() => {
    getValidAccountUseCaseMock = mock<IApplicationCommand<AccountEntity>>();
    queueMock = mock<IQueue>();

    purchaseBTCUseCase = new PurchaseBTCUseCase(getValidAccountUseCaseMock, queueMock);
  });

  it('should publish a message to the queue after validating the account and balance', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const totalDeposit = 2000;
    const totalWithdraw = 500;
    const amount = 1000;
    const accountEntity = new AccountEntity('John Doe', new Email('john@example.com'), 'password123', accountId);

    accountEntity.setBalance(totalDeposit, totalWithdraw);

    (getValidAccountUseCaseMock.execute as jest.Mock).mockResolvedValue(accountEntity);

    const purchaseBtcDto: PurchaseBtcDto = { accountId, amount };

    await purchaseBTCUseCase.execute(purchaseBtcDto);

    expect(getValidAccountUseCaseMock.execute).toHaveBeenCalledWith(accountId);
    expect(accountEntity.validateWithdraw(amount)).toBe(true);
    expect(queueMock.publish).toHaveBeenCalledWith(Queues.BTC_PURCHASE, {
      accountId,
      amount
    });
  });

  it('should throw an error if the account validation fails', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const amount = 1000;

    (getValidAccountUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Account not found'));

    const purchaseBtcDto: PurchaseBtcDto = { accountId, amount };

    await expect(purchaseBTCUseCase.execute(purchaseBtcDto)).rejects.toThrow('Account not found');
    expect(queueMock.publish).not.toHaveBeenCalled();
  });

  it('should throw an error if the account has insufficient balance', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const totalDeposit = 2000;
    const totalWithdraw = 500;
    const amount = 4000;
    const accountEntity = new AccountEntity('John Doe', new Email('john@example.com'), 'password123', accountId);

    accountEntity.setBalance(totalDeposit, totalWithdraw);

    (getValidAccountUseCaseMock.execute as jest.Mock).mockResolvedValue(accountEntity);

    const purchaseBtcDto: PurchaseBtcDto = { accountId, amount };

    await expect(purchaseBTCUseCase.execute(purchaseBtcDto)).rejects.toThrow(new InvalidError('Insufficient balance'));
    expect(queueMock.publish).not.toHaveBeenCalled();
  });
});
