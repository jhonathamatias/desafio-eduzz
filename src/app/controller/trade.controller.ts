import { type Request, type Response } from 'express';

import { type GetBTCPriceDto } from '../application/dtos';
import type IApplicationCommand from '../application/use-cases/interfaces/application-command.interface';

export default class TradeController {
  constructor(
    protected readonly getBTCPriceUseCase: IApplicationCommand<GetBTCPriceDto>,
    protected readonly purchaseBTCUseCase: IApplicationCommand<void>,
    protected readonly getDailyBTCTotalUseCase: IApplicationCommand<{
      btcPurchaseVolume: number;
      btcSellVolume: number;
    }>,
    protected readonly getHistoryBTCPriceUseCase: IApplicationCommand<{ price: number; date: Date }[]>,
    protected readonly sellBTCUseCase: IApplicationCommand<void>,
    protected readonly getInvestmentsPositionsUseCase: IApplicationCommand<any[]>
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

  public async getDailyBTCTotal(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.params;

    const { btcPurchaseVolume, btcSellVolume } = await this.getDailyBTCTotalUseCase.execute(accountId);

    return res.status(200).json({ btcPurchaseVolume, btcSellVolume });
  }

  public async getHistoryBTCPrice(req: Request, res: Response): Promise<Response> {
    const history = await this.getHistoryBTCPriceUseCase.execute();

    return res.status(200).json({ history });
  }

  public async sellBTC(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.params;
    const { amount } = req.body;

    await this.sellBTCUseCase.execute(accountId, amount);

    return res.status(200).json({ message: 'Sell request processed' });
  }

  public async getInvestmentsPositions(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.params;

    const positions = await this.getInvestmentsPositionsUseCase.execute(accountId);

    return res.status(200).json({ positions });
  }
}
