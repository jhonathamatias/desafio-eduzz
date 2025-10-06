import CreateAccountUseCase from '@/app/application/use-cases/account/create-account.usecase';
import ValidateLoginUseCase from '@/app/application/use-cases/login/validate-login.usecase';
import AccountController from '@/app/controller/account.controller';
import LoginController from '@/app/controller/login.controller';
import { container } from '@/container';

export default function () {
  container.register(AccountController.name, () => {
    return new AccountController(container.resolve<CreateAccountUseCase>(CreateAccountUseCase.name));
  });

  container.register(LoginController.name, () => {
    return new LoginController(container.resolve<ValidateLoginUseCase>(ValidateLoginUseCase.name));
  });
}
