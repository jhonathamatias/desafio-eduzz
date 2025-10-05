import { mock } from 'jest-mock-extended';

import { NotFoundError } from '@/app/application/errors';
import { GetValidAccountUseCase } from '@/app/application/use-cases/account/get-valid-account.usecase';
import { AccountEntity } from '@/app/domain/entities';
import { Email } from '@/app/domain/value-objects';
import { type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('GetValidAccountUseCase', () => {
  let repository: IRepository;
  let getValidAccountUseCase: GetValidAccountUseCase;

  beforeEach(() => {
    repository = mock<IRepository>();
    getValidAccountUseCase = new GetValidAccountUseCase(repository);
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
