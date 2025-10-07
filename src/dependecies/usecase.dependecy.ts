import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import { GetValidAccountUseCase } from '@/app/application/use-cases/account/get-valid-account.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import Jwt from '@/app/infrastructure/auth/jwt';
import { DepositPrismaRepository } from '@/app/infrastructure/repositories/prisma/deposit.prisma.repository';
import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { container as c } from '@/container';

export default function () {
  c.register(CreateAccountUseCase.name, () => {
    return new CreateAccountUseCase(
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name)
    );
  });

  c.register(ValidateLoginUseCase.name, () => {
    return new ValidateLoginUseCase(
      c.resolve<Jwt>(Jwt.name),
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name)
    );
  });

  c.register<GetValidAccountUseCase>(GetValidAccountUseCase.name, () => {
    return new GetValidAccountUseCase(c.resolve<PrismaRepository>(PrismaRepository.name));
  });

  c.register(DepositToAccountUseCase.name, () => {
    return new DepositToAccountUseCase(
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name),
      c.resolve<DepositPrismaRepository>(DepositPrismaRepository.name),
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name)
    );
  });

  c.register(GetAccountBalanceUseCase.name, () => {
    return new GetAccountBalanceUseCase(
      c.resolve<DepositPrismaRepository>(DepositPrismaRepository.name),
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name)
    );
  });
}
