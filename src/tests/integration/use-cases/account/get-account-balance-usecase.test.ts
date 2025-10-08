import { mock } from 'jest-mock-extended';

import { NotFoundError } from '@/app/application/errors';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import { type ITransactionRepository } from '@/app/infrastructure/repositories/interfaces';

describe('GetAccountBalanceUseCase', () => {
  let transactionRepositoryMock: ITransactionRepository;
  let getValidAccountUseCaseMock: IApplicationCommand<AccountEntity>;
  let getAccountBalanceUseCase: GetAccountBalanceUseCase;

  beforeEach(() => {
    transactionRepositoryMock = mock<ITransactionRepository>();
    getValidAccountUseCaseMock = mock<IApplicationCommand<AccountEntity>>();

    getAccountBalanceUseCase = new GetAccountBalanceUseCase(transactionRepositoryMock, getValidAccountUseCaseMock);
  });

  it('should return the correct account balance', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const totalDeposit = 2000;
    const totalWithdraw = 500;
    const expectedBalance = 1500;
    const accountEntity = new AccountEntity('John Doe', new Email('john@example.com'), 'password123', accountId);

    accountEntity.setBalance(totalDeposit, totalWithdraw);

    (getValidAccountUseCaseMock.execute as jest.Mock).mockResolvedValue(accountEntity);
    (transactionRepositoryMock.getTotalTransaction as jest.Mock)
      .mockResolvedValueOnce(totalDeposit)
      .mockResolvedValueOnce(totalWithdraw);

    const balance = await getAccountBalanceUseCase.execute(accountId);

    expect(getValidAccountUseCaseMock.execute).toHaveBeenCalledWith(accountId);
    expect(balance).toBe(expectedBalance);
  });

  it('should throw an error if the account is invalid', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    (getValidAccountUseCaseMock.execute as jest.Mock).mockRejectedValue(new NotFoundError('Account not found'));

    await expect(getAccountBalanceUseCase.execute(accountId)).rejects.toThrow('Account not found');
    expect(getValidAccountUseCaseMock.execute).toHaveBeenCalledWith(accountId);
  });
});
