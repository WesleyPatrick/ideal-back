import { CacheAdapter } from "@domain/adapters/cache";
import { RedisService } from "@infra/config/cache";

export class CacheIntegration implements CacheAdapter {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string, expiryIn: number): Promise<void> {
    await this.redis.set(key, value, "EX", expiryIn); // expiryIn: segundos
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
