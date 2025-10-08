import { type IBitcoinRepository } from '@/app/infrastructure/repositories/interfaces/bitcoin.repository.interface';

import { type GetBTCPriceDto } from '../../dtos/crypto.dto';
import type IApplicationCommand from '../interfaces/application-command.interface';

export default class GetBTCPriceUseCase implements IApplicationCommand<GetBTCPriceDto> {
  constructor(protected readonly bitcoinRepository: IBitcoinRepository) {}

  public async execute(): Promise<GetBTCPriceDto> {
    return await this.bitcoinRepository.getPrice();
  }
}
