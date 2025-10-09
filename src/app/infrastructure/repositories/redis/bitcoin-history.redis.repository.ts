import Redis from 'ioredis';

import { type IBitcoinHistoryRepository } from '@/app/infrastructure/repositories/interfaces';

export default class BitcoinHistoryRedisRepository implements IBitcoinHistoryRepository {
  private readonly redis: Redis;
  private readonly key: string = 'bitcoin:price:history';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    });
  }

  public async recordPrice(price: number): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);

    await this.redis.zadd(this.key, timestamp, JSON.stringify({ timestamp, price }));

    const cutoff = timestamp - 86400;
    await this.redis.zremrangebyscore(this.key, 0, cutoff);
  }

  public async getHistory(): Promise<{ price: number; date: Date }[]> {
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - 86400;

    const items = await this.redis.zrevrangebyscore(this.key, now, cutoff);

    return items.map(item => {
      const parsed = JSON.parse(item);
      return { price: parsed.price, date: new Date(parsed.timestamp * 1000) };
    });
  }
}
