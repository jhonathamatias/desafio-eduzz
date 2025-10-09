import { type IBitcoinHistoryRepository } from '@/app/infrastructure/repositories/interfaces';

import type IApplicationCommand from '../interfaces/application-command.interface';

export default class GetHistoryBTCPriceUseCase implements IApplicationCommand<{ price: number; date: Date }[]> {
  constructor(private readonly bitcoinHistoryRepository: IBitcoinHistoryRepository) {}

  public async execute(): Promise<{ price: number; date: Date }[]> {
    return await this.bitcoinHistoryRepository.getHistory();
  }
}
