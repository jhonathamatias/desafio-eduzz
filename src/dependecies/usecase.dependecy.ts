import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import { DepositNotificationUseCase } from '@/app/application/use-cases/account/deposit-notification.usecase';
import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import { GetValidAccountUseCase } from '@/app/application/use-cases/account/get-valid-account.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import GetBTCPriceUseCase from '@/app/application/use-cases/trades/get-btc-price.usecase';
import { ProcessPurchaseBTCUseCase } from '@/app/application/use-cases/trades/process-purchase-btc.usecase';
import PurchaseBTCUseCase from '@/app/application/use-cases/trades/purchase-btc.usecase';
import Jwt from '@/app/infrastructure/auth/jwt';
import { SendGridMail } from '@/app/infrastructure/mail/sendgrid.mail';
import RabbitMQQueue from '@/app/infrastructure/queue/rabbitmq.queue';
import BitcoinRepository from '@/app/infrastructure/repositories/api/bitcoin.repository';
import PrismaCriteria from '@/app/infrastructure/repositories/prisma/prisma.criteria';
import PrismaRepository from '@/app/infrastructure/repositories/prisma/prisma.repository';
import { TransactionPrismaRepository } from '@/app/infrastructure/repositories/prisma/transaction.prisma.repository';
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
    return new GetValidAccountUseCase(
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name),
      c.resolve<TransactionPrismaRepository>(TransactionPrismaRepository.name)
    );
  });

  c.register(DepositToAccountUseCase.name, () => {
    return new DepositToAccountUseCase(
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name),
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name),
      c.resolve<RabbitMQQueue>(RabbitMQQueue.name)
    );
  });

  c.register(GetAccountBalanceUseCase.name, () => {
    return new GetAccountBalanceUseCase(
      c.resolve<TransactionPrismaRepository>(TransactionPrismaRepository.name),
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name)
    );
  });

  c.register<DepositNotificationUseCase>(DepositNotificationUseCase.name, () => {
    return new DepositNotificationUseCase(c.resolve<SendGridMail>(SendGridMail.name));
  });

  c.register(GetBTCPriceUseCase.name, () => {
    return new GetBTCPriceUseCase(c.resolve<BitcoinRepository>(BitcoinRepository.name));
  });

  c.register(PurchaseBTCUseCase.name, () => {
    return new PurchaseBTCUseCase(
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name),
      c.resolve<RabbitMQQueue>(RabbitMQQueue.name)
    );
  });

  c.register(ProcessPurchaseBTCUseCase.name, () => {
    return new ProcessPurchaseBTCUseCase(
      c.resolve<PrismaRepository>(PrismaRepository.name),
      c.resolve<PrismaCriteria>(PrismaCriteria.name),
      c.resolve<GetValidAccountUseCase>(GetValidAccountUseCase.name),
      c.resolve<BitcoinRepository>(BitcoinRepository.name),
      c.resolve<RabbitMQQueue>(RabbitMQQueue.name)
    );
  });
}
