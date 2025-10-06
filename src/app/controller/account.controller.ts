import { type Request, type Response } from 'express';

import { type GetAccountDto } from '@/app/application/dtos';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';

export default class AccountController {
  constructor(
    protected readonly createAccountUseCase: IApplicationCommand<GetAccountDto>,
    protected readonly depositToAccountUseCase: IApplicationCommand<{ balance: number }>,
    protected readonly getAccountBalanceUseCase: IApplicationCommand<number>
  ) {}

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    const account = await this.createAccountUseCase.execute({ name, email, password });

    return res.status(201).json({ ...account });
  };

  public deposit = async (req: Request, res: Response): Promise<Response> => {
    const { amount } = req.body;
    const { accountId } = req.params;

    const balance = await this.depositToAccountUseCase.execute({ accountId, amount });

    return res.status(200).json({ ...balance });
  };

  public getBalance = async (req: Request, res: Response): Promise<Response> => {
    const { accountId } = req.params;

    const balance = await this.getAccountBalanceUseCase.execute(accountId);

    return res.status(200).json({ accountId, balance });
  };
}
