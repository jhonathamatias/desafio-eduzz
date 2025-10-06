import { mock, type MockProxy } from 'jest-mock-extended';

import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { AccountEntity } from '@/app/domain/entities';
import { InvalidError } from '@/app/domain/errors';
import { Email } from '@/app/domain/value-objects';
import { type IDepositRepository, type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('DepositToAccountUseCase', () => {
  let repository: ReturnType<typeof mock<IRepository>>;
  let getValidAccountUseCase: ReturnType<typeof mock<any>>;
  let depositToAccountUseCase: DepositToAccountUseCase;
  let depositRepository: MockProxy<IDepositRepository>;

  beforeEach(() => {
    repository = mock<IRepository>();
    depositRepository = mock<IDepositRepository>();
    getValidAccountUseCase = mock<any>();

    depositToAccountUseCase = new DepositToAccountUseCase(repository, depositRepository, getValidAccountUseCase);
  });

  it('should save a valid deposit to the repository', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const amount = 100;
    const accountEntity = new AccountEntity('John Doe', new Email('test@example.com'), 'password123', accountId);

    getValidAccountUseCase.execute.mockResolvedValue(accountEntity);
    depositRepository.sumAmountsByAccountId.mockResolvedValue(500);

    const result = await depositToAccountUseCase.execute({ accountId, amount });

    expect(getValidAccountUseCase.execute).toHaveBeenCalledWith(accountId);
    expect(repository.setCollection).toHaveBeenCalledWith('deposits');
    expect(repository.save).toHaveBeenCalledWith({
      accountId,
      amount
    });
    expect(result).toEqual({ balance: 500 });
  });

  it('should throw an error if the deposit is invalid', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const amount = -350;
    const accountEntity = new AccountEntity('John Doe', new Email('test@example.com'), 'password123', accountId);

    getValidAccountUseCase.execute.mockResolvedValue(accountEntity);
    depositRepository.sumAmountsByAccountId.mockResolvedValue(200);

    await expect(depositToAccountUseCase.execute({ accountId, amount })).rejects.toThrow(
      new InvalidError('Its not possible to deposit negative values')
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
