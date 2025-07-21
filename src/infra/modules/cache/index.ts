import { CacheAdapter } from "@domain/adapters/cache";
import { RedisService } from "@infra/config/cache";
import { CacheIntegration } from "@infra/integrations/cache";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    RedisService,
    {
      provide: CacheAdapter,
      useClass: CacheIntegration
    }
  ],
  exports: [CacheAdapter]
})
export class CacheModule {}
