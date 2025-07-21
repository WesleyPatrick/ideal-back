import { OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { env } from "process";

export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      host: String(env.REDIS_HOST),
      port: Number(env.REDIS_PORT),
      db: Number(env.REDIS_DB)
    });
  }

  onModuleDestroy(): void {
    return this.disconnect();
  }
}
