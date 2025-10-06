import bcrypt from 'bcrypt';

import { type ValidateLoginDto } from '@/app/application/dtos';
import { CredentialsError } from '@/app/application/errors';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import type Jwt from '@/app/infrastructure/auth/jwt';
import type { ICriteria, IRepository } from '@/app/infrastructure/repositories/interfaces';

export default class ValidateLoginUseCase implements IApplicationCommand {
  constructor(
    protected readonly jwt: Jwt,
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria
  ) {}

  public async execute({ email, password }: ValidateLoginDto): Promise<{ token: string }> {
    const { password: storedPassword, accountId } = (await this.getAccount(email)) as {
      password: string;
      accountId: string;
    };

    await this.validatePasswords(password, storedPassword);

    const token = this.generateToken(accountId);

    return { token };
  }

  protected async getAccount(email: string): Promise<any> {
    this.repository.setCollection('accounts');
    this.criteria.clear();
    this.criteria.equal('email', email);

    const result = await this.repository.matching(this.criteria);
    const account = await result.first();

    if (!account) {
      throw new CredentialsError('invalid login');
    }

    return account;
  }

  protected async validatePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordValid) {
      throw new CredentialsError('invalid password');
    }

    return isPasswordValid;
  }

  protected generateToken(accountId: string): string {
    const token = this.jwt.generateToken({ accountId }, 3600);
    return token;
  }
}
