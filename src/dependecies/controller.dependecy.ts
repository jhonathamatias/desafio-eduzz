import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import GetTransactionsStatementUseCase from '@/app/application/use-cases/account/get-transactions-statement.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import GetBTCPriceUseCase from '@/app/application/use-cases/trades/get-btc-price.usecase';
import GetDailyBTCTotalUseCase from '@/app/application/use-cases/trades/get-daily-btc-total.usecase';
import GetHistoryBTCPriceUseCase from '@/app/application/use-cases/trades/get-history-btc-price';
import { GetInvestmentsPositionsUseCase } from '@/app/application/use-cases/trades/get-investments-positions';
import PurchaseBTCUseCase from '@/app/application/use-cases/trades/purchase-btc.usecase';
import SellBTCUseCase from '@/app/application/use-cases/trades/sell-btc.usecase';
import AccountController from '@/app/controller/account.controller';
import LoginController from '@/app/controller/login.controller';
import TradeController from '@/app/controller/trade.controller';
import { container as c } from '@/container';

export default function () {
  c.register(AccountController.name, () => {
    return new AccountController(
      c.resolve<CreateAccountUseCase>(CreateAccountUseCase.name),
      c.resolve<DepositToAccountUseCase>(DepositToAccountUseCase.name),
      c.resolve<GetAccountBalanceUseCase>(GetAccountBalanceUseCase.name),
      c.resolve<GetTransactionsStatementUseCase>(GetTransactionsStatementUseCase.name)
    );
  });

  c.register(LoginController.name, () => {
    return new LoginController(c.resolve<ValidateLoginUseCase>(ValidateLoginUseCase.name));
  });

  c.register(TradeController.name, () => {
    return new TradeController(
      c.resolve<GetBTCPriceUseCase>(GetBTCPriceUseCase.name),
      c.resolve<PurchaseBTCUseCase>(PurchaseBTCUseCase.name),
      c.resolve<GetDailyBTCTotalUseCase>(GetDailyBTCTotalUseCase.name),
      c.resolve<GetHistoryBTCPriceUseCase>(GetHistoryBTCPriceUseCase.name),
      c.resolve<SellBTCUseCase>(SellBTCUseCase.name),
      c.resolve<GetInvestmentsPositionsUseCase>(GetInvestmentsPositionsUseCase.name)
    );
  });
}
