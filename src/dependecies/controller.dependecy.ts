import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import DepositToAccountUseCase from '@/app/application/use-cases/account/deposit-to-account.usecase';
import { GetAccountBalanceUseCase } from '@/app/application/use-cases/account/get-account-balance.usecase';
import GetBTCPriceUseCase from '@/app/application/use-cases/trades/get-btc-price.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import AccountController from '@/app/controller/account.controller';
import BitcoinController from '@/app/controller/bitcoin.controller';
import LoginController from '@/app/controller/login.controller';
import { container as c } from '@/container';

export default function () {
  c.register(AccountController.name, () => {
    return new AccountController(
      c.resolve<CreateAccountUseCase>(CreateAccountUseCase.name),
      c.resolve<DepositToAccountUseCase>(DepositToAccountUseCase.name),
      c.resolve<GetAccountBalanceUseCase>(GetAccountBalanceUseCase.name)
    );
  });

  c.register(LoginController.name, () => {
    return new LoginController(c.resolve<ValidateLoginUseCase>(ValidateLoginUseCase.name));
  });

  c.register(BitcoinController.name, () => {
    return new BitcoinController(c.resolve<GetBTCPriceUseCase>(GetBTCPriceUseCase.name));
  });
}
