import { type Request, type Response } from 'express';

import { type GetBTCPriceDto } from '../application/dtos';
import type IApplicationCommand from '../application/use-cases/interfaces/application-command.interface';

export default class BitcoinController {
  constructor(private readonly getBTCPriceUseCase: IApplicationCommand<GetBTCPriceDto>) {}

  public async getBitcoinPrice(req: Request, res: Response): Promise<Response> {
    const { buy, sell } = await this.getBTCPriceUseCase.execute();
    return res.status(200).json({ buy, sell });
  }
}
