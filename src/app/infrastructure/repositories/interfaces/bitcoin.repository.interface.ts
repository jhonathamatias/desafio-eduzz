import { type GetBTCPriceDto } from '@/app/application/dtos';

export interface IBitcoinRepository {
  getPrice(): Promise<GetBTCPriceDto>;
}
