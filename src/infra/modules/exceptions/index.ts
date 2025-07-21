import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsIntegration } from "@infra/integrations/exceptions";
import { Module } from "@nestjs/common";

@Module({
  providers: [{ provide: ExceptionsAdapter, useClass: ExceptionsIntegration }],
  exports: [{ provide: ExceptionsAdapter, useClass: ExceptionsIntegration }]
})
export class ExceptionsModule {}
