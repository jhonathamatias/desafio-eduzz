import { mock, type MockProxy } from 'jest-mock-extended';

import { TransactionDirection, TransactionType } from '@/app/application/enums/transaction.enum';
import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { type GetValidAccountUseCase } from '@/app/application/use-cases/account/get-valid-account.usecase';
import { AccountEntity } from '@/app/domain/entities';
import { InvalidError } from '@/app/domain/errors';
import { Email } from '@/app/domain/value-objects';
import type IQueue from '@/app/infrastructure/queue/interfaces/queue.interface';
import Collection from '@/app/infrastructure/repositories/collection.repository';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('DepositToAccountUseCase', () => {
  let repository: ReturnType<typeof mock<IRepository>>;
  let getValidAccountUseCase: ReturnType<typeof mock<any>>;
  let criteria: MockProxy<ICriteria>;
  let depositToAccountUseCase: DepositToAccountUseCase;
  let queue: MockProxy<IQueue>;

  beforeEach(() => {
    repository = mock<IRepository>();
    criteria = mock<ICriteria>();
    getValidAccountUseCase = mock<GetValidAccountUseCase>();
    queue = mock<IQueue>();

    queue.publish.mockResolvedValue();

    depositToAccountUseCase = new DepositToAccountUseCase(repository, criteria, getValidAccountUseCase, queue);
  });

  it('should save a valid deposit to the repository', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const currencyId = '123e4567-e89b-12d3-a456-426614174078';
    const amount = 100;
    const accountEntity = new AccountEntity('John Doe', new Email('test@example.com'), 'password123', accountId);

    getValidAccountUseCase.execute.mockResolvedValue(accountEntity);
    repository.matching.mockResolvedValue(new Collection([{ id: currencyId }]));

    accountEntity.setBalance(600, 100);

    await depositToAccountUseCase.execute({ accountId, amount });

    expect(getValidAccountUseCase.execute).toHaveBeenCalledWith(accountId);
    expect(repository.save).toHaveBeenCalledWith({
      account_id: accountId,
      amount,
      currency_id: currencyId,
      direction: TransactionDirection.CREDIT,
      type: TransactionType.DEPOSIT
    });
  });

  it('should throw an error if the deposit is invalid', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const amount = -350;
    const accountEntity = new AccountEntity('John Doe', new Email('test@example.com'), 'password123', accountId);

    getValidAccountUseCase.execute.mockResolvedValue(accountEntity);

    await expect(depositToAccountUseCase.execute({ accountId, amount })).rejects.toThrow(
      new InvalidError('Its not possible to deposit negative values')
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the deposit amount is zero', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const amount = 0;
    const accountEntity = new AccountEntity('John Doe', new Email('test@example.com'), 'password123', accountId);

    getValidAccountUseCase.execute.mockResolvedValue(accountEntity);

    await expect(depositToAccountUseCase.execute({ accountId, amount })).rejects.toThrow(
      new InvalidError('Its not possible to deposit zero value')
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
