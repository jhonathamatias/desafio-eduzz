import { type GetBTCPriceDto } from '@/app/application/dtos/crypto.dto';
import MercadoBitcoinAPI from '@/app/infrastructure/api/mercadobitcoin.api';

import { type IBitcoinRepository } from '../interfaces/bitcoin.repository.interface';

export default class BitcoinRepository implements IBitcoinRepository {
  private readonly mercadoBitcoinAPI: MercadoBitcoinAPI;

  constructor() {
    this.mercadoBitcoinAPI = new MercadoBitcoinAPI();
  }

  public async getPrice(): Promise<GetBTCPriceDto> {
    return await this.mercadoBitcoinAPI.getBitcoinPrice();
  }
}
