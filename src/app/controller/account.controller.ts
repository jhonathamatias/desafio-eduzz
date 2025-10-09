import { type Request, type Response } from 'express';

import { type GetAccountDto } from '@/app/application/dtos';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';

export default class AccountController {
  constructor(
    protected readonly createAccountUseCase: IApplicationCommand<GetAccountDto>,
    protected readonly depositToAccountUseCase: IApplicationCommand,
    protected readonly getAccountBalanceUseCase: IApplicationCommand<number>,
    protected readonly getTransactionsStatementUseCase: IApplicationCommand<any[]>
  ) {}

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    const account = await this.createAccountUseCase.execute({ name, email, password });

    return res.status(201).json({ ...account });
  };

  public deposit = async (req: Request, res: Response): Promise<Response> => {
    const { amount } = req.body;
    const { accountId } = req.params;

    await this.depositToAccountUseCase.execute({ accountId, amount });

    return res.status(200).json({ message: 'Deposit request received' });
  };

  public getBalance = async (req: Request, res: Response): Promise<Response> => {
    const { accountId } = req.params;

    const balance = await this.getAccountBalanceUseCase.execute(accountId);

    return res.status(200).json({ accountId, balance });
  };

  public getTransactionsStatement = async (req: Request, res: Response): Promise<Response> => {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const statement = await this.getTransactionsStatementUseCase.execute(accountId, start, end);

    return res.status(200).json({ accountId, statement });
  };
}
