import { type GetBTCPriceDto } from '@/app/application/dtos';
import HttpClient from '@/app/infrastructure/http/client.http';

export default class MercadoBitcoinAPI {
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('https://www.mercadobitcoin.net/api');
  }

  public async getBitcoinPrice(): Promise<GetBTCPriceDto> {
    const response = await this.httpClient.get<{ ticker: { buy: number; sell: number; last: number } }>('/BTC/ticker/');
    return response.ticker;
  }
}
