import BitcoinRepository from '@/app/infrastructure/repositories/api/bitcoin.repository';
import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { TransactionPrismaRepository } from '@/app/infrastructure/repositories/prisma/transaction.prisma.repository';
import { container as c } from '@/container';
import { PrismaClient } from '@/generated/prisma';

export default function () {
  c.register(PrismaClient.name, () => new PrismaClient());

  c.register(PrismaCriteria.name, () => new PrismaCriteria());

  c.register(PrismaRepository.name, () => {
    return new PrismaRepository(c.resolve<PrismaClient>(PrismaClient.name));
  });

  c.register(TransactionPrismaRepository.name, () => {
    return new TransactionPrismaRepository(c.resolve<PrismaClient>(PrismaClient.name));
  });

  c.register(BitcoinRepository.name, () => new BitcoinRepository());
}
