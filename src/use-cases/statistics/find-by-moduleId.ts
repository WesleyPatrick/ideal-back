import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

@Injectable()
export class FindStatisticsByModuleIdUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(moduleId: string): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMission({
        moduleId
      });

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMission({
        moduleId
      });

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMission({
        moduleId
      });

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMission({
        moduleId
      });

    const avgDaysToReturn =
      await this.statisticsRepository.getAvgReturnTimeForModuleOrMission({
        moduleId
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
