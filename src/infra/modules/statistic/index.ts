import { StatisticController } from "@infra/controllers/statistic";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { FindStatisticsByModuleIdUseCase } from "@use-cases/statistics/find-by-moduleId";
import { FindStatisticsByModuleIdAndMissionUseCase } from "@use-cases/statistics/find-by-moduleId-and-missionId";
import { FindStatisticsByModuleIdAndServiceProviderIdUseCase } from "@use-cases/statistics/find-by-moduleId-and-serviceProviderId";
import { FindStatisticsByModuleIdAndMissionByServiceProviderIdUseCase } from "@use-cases/statistics/find-by-moduleId-missionId-and-serviceProviderId";
import { FindStatisticsByModuleIdAndUserIdUseCase } from "@use-cases/statistics/find-by-moduleId-and-userId";
import { FindStatisticsByModuleIdAndMissionByUserIdUseCase } from "@use-cases/statistics/find-by-moduleId-missionId-and-userId";

@Module({
  imports: [DatabaseModule],
  controllers: [StatisticController],
  providers: [
    FindStatisticsByModuleIdUseCase,
    FindStatisticsByModuleIdAndMissionUseCase,
    FindStatisticsByModuleIdAndServiceProviderIdUseCase,
    FindStatisticsByModuleIdAndMissionByServiceProviderIdUseCase,
    FindStatisticsByModuleIdAndUserIdUseCase,
    FindStatisticsByModuleIdAndMissionByUserIdUseCase
  ]
})
export class StatisticModule {}
