import { SSEAdapter } from "@domain/adapters/sse";
import { SSEIntegration } from "@infra/integrations/sse";
import { Module } from "@nestjs/common";

@Module({
  providers: [{ provide: SSEAdapter, useClass: SSEIntegration }],
  exports: [{ provide: SSEAdapter, useClass: SSEIntegration }]
})
export class SSEModule {}
