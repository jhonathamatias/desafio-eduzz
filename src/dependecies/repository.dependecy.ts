import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { container } from '@/container';
import { PrismaClient } from '@/generated/prisma';

export default function () {
  container.register(PrismaClient.name, () => new PrismaClient());

  container.register(PrismaCriteria.name, () => new PrismaCriteria());

  container.register(PrismaRepository.name, () => {
    const prisma = container.resolve<PrismaClient>(PrismaClient.name);
    return new PrismaRepository(prisma);
  });
}
