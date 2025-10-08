import { mock, type MockProxy } from 'jest-mock-extended';

import { NotFoundError } from '@/app/application/errors';
import { GetValidAccountUseCase } from '@/app/application/use-cases/account/get-valid-account.usecase';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import Collection from '@/app/infrastructure/repositories/collection.repository';
import {
  type ITransactionRepository,
  type ICriteria,
  type IRepository
} from '@/app/infrastructure/repositories/interfaces';

describe('GetValidAccountUseCase', () => {
  let repository: MockProxy<IRepository>;
  let getValidAccountUseCase: GetValidAccountUseCase;
  let criteriaMock: MockProxy<ICriteria>;
  let transactionRepositoryMock: MockProxy<ITransactionRepository>;

  beforeEach(() => {
    repository = mock<IRepository>();
    criteriaMock = mock<ICriteria>();
    transactionRepositoryMock = mock<ITransactionRepository>();
    criteriaMock.clear.mockReturnValueOnce();
    transactionRepositoryMock.getTotalTransaction.mockResolvedValue(0);

    getValidAccountUseCase = new GetValidAccountUseCase(repository, criteriaMock, transactionRepositoryMock);
  });

  it('should return a valid account when the account exists', async () => {
    const accountId = '550e8400-e29b-41d4-a716-446655440000';
    const accountData = {
      id: accountId,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashed-password'
    };
    (repository.getById as jest.Mock).mockResolvedValue(accountData);
    repository.matching.mockResolvedValue(new Collection([{ id: 'currency-id', code: 'BRL' }]));
    const result = await getValidAccountUseCase.execute(accountId);

    expect(result).toBeInstanceOf(AccountEntity);
    expect(result.id).toBe(accountData.id);
    expect(result.email).toBeInstanceOf(Email);
    expect(result.email.getValue()).toBe(accountData.email);
    expect(repository.getById).toHaveBeenCalledWith(accountId);
  });

  it('should throw an error when the account does not exist', async () => {
    const accountId = '550e8400-e29b-41d4-a716-446655440000 ';
    (repository.getById as jest.Mock).mockResolvedValue(null);

    await expect(getValidAccountUseCase.execute(accountId)).rejects.toThrow(NotFoundError);
    expect(repository.getById).toHaveBeenCalledWith(accountId);
  });
});
