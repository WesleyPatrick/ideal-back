import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

@Injectable()
export class FindStatisticsByModuleIdAndUserIdUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(moduleId: string, userId: string): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMissionByUserId({
        moduleId,
        userId
      });

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMissionByUserId(
        {
          userId,
          moduleId
        }
      );

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMissionByUserId(
        {
          userId,
          moduleId
        }
      );

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMissionByUserId({
        userId,
        moduleId
      });

    const avgDaysToReturn =
      await this.statisticsRepository.getAvgReturnTimeForModuleOrMissionByUserId(
        userId
      );

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
