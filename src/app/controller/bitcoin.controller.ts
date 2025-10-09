import { type Request, type Response } from 'express';

import { type GetBTCPriceDto } from '../application/dtos';
import type IApplicationCommand from '../application/use-cases/interfaces/application-command.interface';

export default class BitcoinController {
  constructor(
    protected readonly getBTCPriceUseCase: IApplicationCommand<GetBTCPriceDto>,
    protected readonly purchaseBTCUseCase: IApplicationCommand<void>
  ) {}

  public async getBitcoinPrice(req: Request, res: Response): Promise<Response> {
    const { buy, sell } = await this.getBTCPriceUseCase.execute();
    return res.status(200).json({ buy, sell });
  }

  public async purchaseBTC(req: Request, res: Response): Promise<Response> {
    const { amount } = req.body;
    const { accountId } = req.params;
    await this.purchaseBTCUseCase.execute({ accountId, amount });
    return res.status(200).json({ message: 'Purchase request received' });
  }
}
