import bcrypt from 'bcrypt';
import { mock, type MockProxy } from 'jest-mock-extended';

import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import { type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let repository: MockProxy<IRepository>;
  let criteria: MockProxy<ICriteria>;

  beforeEach(() => {
    repository = mock<IRepository>();
    repository.getInsertedLastId.mockResolvedValue('123');
    repository.getById.mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com'
    });
    criteria = mock<ICriteria>();
    repository.matching.mockResolvedValue({
      add: jest.fn(),
      remove: jest.fn(),
      toArray: jest.fn(),
      count: jest.fn(),
      first: jest.fn(),
      getIterator: jest.fn(),
      last: jest.fn(),
      setItems: jest.fn(),
      [Symbol.iterator]: jest.fn()
    });

    createAccountUseCase = new CreateAccountUseCase(repository, criteria);
  });

  it('should create an account successfully', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'password123';

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPasswordMock' as never);

    const result = await createAccountUseCase.execute({ name, email, password });

    expect(repository.setCollection).toHaveBeenCalledWith('account');
    expect(repository.save).toHaveBeenCalledWith({
      name,
      email,
      password: 'hashedPasswordMock'
    });
    expect(repository.getInsertedLastId).toHaveBeenCalled();
    expect(repository.getById).toHaveBeenCalledWith('123');
    expect(result).toEqual({
      id: '123',
      name,
      email
    });
  });

  it('should throw an error if account creation fails', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'password123';

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPasswordMock' as never);
    repository.getById.mockResolvedValue(null);

    await expect(createAccountUseCase.execute({ name, email, password })).rejects.toThrow('Account creation failed');
  });
});
