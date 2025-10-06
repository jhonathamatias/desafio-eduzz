import { DepositPrismaRepository } from '@/app/infrastructure/repositories/prisma/deposit.prisma.repository';
import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { container as c } from '@/container';
import { PrismaClient } from '@/generated/prisma';

export default function () {
  c.register(PrismaClient.name, () => new PrismaClient());

  c.register(PrismaCriteria.name, () => new PrismaCriteria());

  c.register(PrismaRepository.name, () => {
    return new PrismaRepository(c.resolve<PrismaClient>(PrismaClient.name));
  });

  c.register(DepositPrismaRepository.name, () => {
    return new DepositPrismaRepository(c.resolve<PrismaClient>(PrismaClient.name));
  });
}
