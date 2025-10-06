import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import Jwt from '@/app/infrastructure/auth/jwt';
import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { container } from '@/container';

export default function () {
  container.register(CreateAccountUseCase.name, () => {
    const repository = container.resolve<PrismaRepository>(PrismaRepository.name);
    const criteria = container.resolve<PrismaCriteria>(PrismaCriteria.name);
    return new CreateAccountUseCase(repository, criteria);
  });

  container.register(ValidateLoginUseCase.name, () => {
    const repository = container.resolve<PrismaRepository>(PrismaRepository.name);
    const criteria = container.resolve<PrismaCriteria>(PrismaCriteria.name);
    const jwt = container.resolve<Jwt>(Jwt.name);
    return new ValidateLoginUseCase(jwt, repository, criteria);
  });
}
