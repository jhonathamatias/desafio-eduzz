import { type Request, type Response } from 'express';

import { type GetAccountDto } from '@/app/application/dtos';
import type IApplicationCommand from '@/app/application/use-cases/interfaces/application-command.interface';

export default class AccountController {
  constructor(protected createAccountUseCase: IApplicationCommand<GetAccountDto>) {}

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    const account = await this.createAccountUseCase.execute({ name, email, password });

    return res.status(201).json({ ...account });
  };
}
