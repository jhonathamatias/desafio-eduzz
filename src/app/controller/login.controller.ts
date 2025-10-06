import { type Request, type Response } from 'express';

import type IApplicationCommand from '../application/use-cases/interfaces/application-command.interface';

export default class LoginController {
  constructor(protected readonly validateLoginUseCase: IApplicationCommand) {}
  public login = async (req: Request, res: Response): Promise<Response> => {
    const token = await this.validateLoginUseCase.execute(req.body);

    return res.status(200).json(token);
  };
}
