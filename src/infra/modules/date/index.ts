import { Module } from "@nestjs/common";
import { DateAdapter } from "@domain/adapters/date";
import { DateFnsIntegration } from "@infra/integrations/date/date-fns";

@Module({
  providers: [{ provide: DateAdapter, useClass: DateFnsIntegration }],
  exports: [{ provide: DateAdapter, useClass: DateFnsIntegration }]
})
export class DateModule {}
