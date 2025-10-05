import bcrypt from 'bcrypt';

import { CredentialsError, NotFoundError } from '@/app/application/errors';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import type Jwt from '@/app/infrastructure/auth/jwt';
import type { ICriteria, IRepository } from '@/app/infrastructure/repositories/interfaces';

describe('ValidateLoginUseCase', () => {
  let validateLoginUseCase: ValidateLoginUseCase;
  let mockJwt: Jwt;
  let mockRepository: IRepository;
  let mockCriteria: ICriteria;
  let matchingResult: { first: jest.Mock };

  beforeEach(() => {
    mockJwt = {
      generateToken: jest.fn()
    } as unknown as Jwt;

    matchingResult = { first: jest.fn() };

    mockRepository = {
      setCollection: jest.fn(),
      matching: jest.fn().mockReturnValue(matchingResult)
    } as unknown as IRepository;

    mockCriteria = {
      equal: jest.fn()
    } as unknown as ICriteria;

    validateLoginUseCase = new ValidateLoginUseCase(mockJwt, mockRepository, mockCriteria);
  });

  it('should generate a token for valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const accountId = 'account123';
    const hashedPassword = 'hashedPasswordMock';

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    matchingResult.first.mockResolvedValue({ password: hashedPassword, accountId });

    jest.spyOn(mockJwt, 'generateToken').mockReturnValue('mockToken');

    const result = await validateLoginUseCase.execute({ email, password });

    expect(mockRepository.setCollection).toHaveBeenCalledWith('accounts');
    expect(mockCriteria.equal).toHaveBeenCalledWith('email', email);
    expect(mockJwt.generateToken).toHaveBeenCalledWith({ accountId }, 3600);
    expect(result).toEqual({ token: 'mockToken' });
  });

  it('should throw an error if the user is not found', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    matchingResult.first.mockResolvedValue(null);

    await expect(validateLoginUseCase.execute({ email, password })).rejects.toThrow(NotFoundError);
  });

  it('should throw an error if the password is invalid', async () => {
    const email = 'test@example.com';
    const password = 'wrongPassword';
    const hashedPassword = 'hashedPasswordMock';

    matchingResult.first.mockResolvedValue({ password: hashedPassword, userId: 'user123' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(validateLoginUseCase.execute({ email, password })).rejects.toThrow(CredentialsError);
  });

  it('should throw an error if email or password is missing', async () => {
    await expect(validateLoginUseCase.execute({ email: '', password: '' })).rejects.toThrow(NotFoundError);
  });
});
