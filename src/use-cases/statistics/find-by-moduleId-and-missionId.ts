import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

@Injectable()
export class FindStatisticsByModuleIdAndMissionUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(
    moduleId: string,
    missionId: string
  ): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMission({
        moduleId,
        missionId
      });

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMission({
        moduleId,
        missionId
      });

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMission({
        moduleId,
        missionId
      });

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMission({
        moduleId,
        missionId
      });

    const avgDaysToReturn =
      await this.statisticsRepository.getAvgReturnTimeForModuleOrMission({
        moduleId,
        missionId
      });

    return {
      metrics: [
        { key: "assertiveness_by_activity", value: accuracyPercentage },
        { key: "completion_time_avg", value: avgDaysToComplete },
        { key: "module_accuracy_avg", value: avgPerformance },
        { key: "error_rate", value: errorPercentage },
        { key: "return_time_avg", value: avgDaysToReturn }
      ]
    };
  }
}
