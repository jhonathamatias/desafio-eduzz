import { type GetBTCPriceDto } from '@/app/application/dtos/crypto.dto';

export interface IBitcoinRepository {
  getPrice(): Promise<GetBTCPriceDto>;
}
