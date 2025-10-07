import { mock } from 'jest-mock-extended';

import { NotFoundError } from '@/app/application/errors';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import { type IDepositRepository } from '@/app/infrastructure/repositories/interfaces';

describe('GetAccountBalanceUseCase', () => {
  let depositRepositoryMock: IDepositRepository;
  let getValidAccountUseCaseMock: IApplicationCommand<AccountEntity>;
  let getAccountBalanceUseCase: GetAccountBalanceUseCase;

  beforeEach(() => {
    depositRepositoryMock = mock<IDepositRepository>();
    getValidAccountUseCaseMock = mock<IApplicationCommand<AccountEntity>>();

    getAccountBalanceUseCase = new GetAccountBalanceUseCase(depositRepositoryMock, getValidAccountUseCaseMock);
  });

  it('should return the correct account balance', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const currencyId = '123e4567-e89b-12d3-a456-426614174456';
    const expectedBalance = 1500;
    const accountEntity = new AccountEntity('John Doe', new Email('john@example.com'), 'password123', accountId);

    (getValidAccountUseCaseMock.execute as jest.Mock).mockResolvedValue(accountEntity);
    (depositRepositoryMock.sumAmounts as jest.Mock).mockResolvedValue(expectedBalance);

    const balance = await getAccountBalanceUseCase.execute(accountId, currencyId);

    expect(getValidAccountUseCaseMock.execute).toHaveBeenCalledWith(accountId);
    expect(depositRepositoryMock.sumAmounts).toHaveBeenCalledWith(accountId, currencyId);
    expect(balance).toBe(expectedBalance);
  });

  it('should throw an error if the account is invalid', async () => {
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const currencyId = '123e4567-e89b-12d3-a456-426614174456';
    (getValidAccountUseCaseMock.execute as jest.Mock).mockRejectedValue(new NotFoundError('Account not found'));

    await expect(getAccountBalanceUseCase.execute(accountId, currencyId)).rejects.toThrow('Account not found');
    expect(getValidAccountUseCaseMock.execute).toHaveBeenCalledWith(accountId);
    expect(depositRepositoryMock.sumAmounts).not.toHaveBeenCalled();
  });
});
