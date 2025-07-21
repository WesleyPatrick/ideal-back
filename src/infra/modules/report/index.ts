import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { ActiveUsersReportUseCase } from "@use-cases/report/active-users";
import { ReportController } from "@infra/controllers/report";
import { MissionsConclusionReportUseCase } from "@use-cases/report/missions-conclusion";
import { SolecasReportUseCase } from "@use-cases/report/solecas";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [ReportController],
  providers: [
    ActiveUsersReportUseCase,
    MissionsConclusionReportUseCase,
    SolecasReportUseCase
  ]
})
export class ReportModule {}
