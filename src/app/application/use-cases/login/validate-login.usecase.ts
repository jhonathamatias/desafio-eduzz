import bcrypt from 'bcrypt';

import type ValidateLoginDto from '@/app/application/dtos/login/validate-login.dto';
import { CredentialsError, NotFoundError } from '@/app/application/errors';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';
import type Jwt from '@/app/infrastructure/auth/jwt';
import type { ICriteria, IRepository } from '@/app/infrastructure/repositories/interfaces';

export default class ValidateLoginUseCase implements IApplicationCommand {
  constructor(
    protected jwt: Jwt,
    protected repository: IRepository,
    protected criteria: ICriteria
  ) {}

  public async execute({ email, password }: ValidateLoginDto): Promise<{ token: string }> {
    const { password: storedPassword, userId } = (await this.getAccount(email)) as { password: string; userId: string };

    await this.validatePasswords(password, storedPassword);

    const token = this.generateToken(userId);

    return { token };
  }

  protected async getAccount(email: string): Promise<any> {
    this.repository.setCollection('accounts');
    this.criteria.equal('email', email);

    const result = await this.repository.matching(this.criteria);
    const account = await result.first();

    if (!account) {
      throw new NotFoundError('Account not found.');
    }

    return account;
  }

  protected async validatePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordValid) {
      throw new CredentialsError('Invalid password');
    }

    return isPasswordValid;
  }

  protected generateToken(userId: string): string {
    const token = this.jwt.generateToken({ userId }, 3600);
    return token;
  }
}
