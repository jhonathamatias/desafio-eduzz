import bcrypt from 'bcrypt';

import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import { type IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let mockRepository: IRepository;

  beforeEach(() => {
    mockRepository = {
      setCollection: jest.fn(),
      save: jest.fn(),
      getInsertedLastId: jest.fn().mockResolvedValue('123'),
      getById: jest.fn().mockResolvedValue({
        id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com'
      })
    } as unknown as IRepository;

    createAccountUseCase = new CreateAccountUseCase(mockRepository);
  });

  it('should create an account successfully', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'password123';

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPasswordMock' as never);

    const result = await createAccountUseCase.execute({ name, email, password });

    expect(mockRepository.setCollection).toHaveBeenCalledWith('accounts');
    expect(mockRepository.save).toHaveBeenCalledWith({
      name,
      email,
      password: 'hashedPasswordMock'
    });
    expect(mockRepository.getInsertedLastId).toHaveBeenCalled();
    expect(mockRepository.getById).toHaveBeenCalledWith('123');
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
    (mockRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(createAccountUseCase.execute({ name, email, password })).rejects.toThrow('Account creation failed');
  });
});
