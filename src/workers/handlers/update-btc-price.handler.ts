import BitcoinRepository from '@/app/infrastructure/repositories/api/bitcoin.repository';
import { type IBitcoinRepository, type IBitcoinHistoryRepository } from '@/app/infrastructure/repositories/interfaces';
import BitcoinHistoryRedisRepository from '@/app/infrastructure/repositories/redis/bitcoin-history.redis.repository';
import { container } from '@/container';

export default async function updateBTCPriceHandler() {
  console.log('Update BTC Price Worker started...');

  const repository = container.resolve<IBitcoinHistoryRepository>(BitcoinHistoryRedisRepository.name);

  const bitcoinRepository = container.resolve<IBitcoinRepository>(BitcoinRepository.name);
  const priceData = await bitcoinRepository.getPrice();
  const price = priceData.buy;

  await repository.recordPrice(price);
  console.log(`Recorded BTC price: ${price}`);
}
