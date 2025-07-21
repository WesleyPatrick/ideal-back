import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

export interface FindStatisticsByUserIdParams {
  moduleId: string;
  missionId: string;
  userId: string;
}

@Injectable()
export class FindStatisticsByModuleIdAndMissionByUserIdUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute({
    missionId,
    moduleId,
    userId
  }: FindStatisticsByUserIdParams): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMissionByUserId({
        userId,
        moduleId,
        missionId
      });

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMissionByUserId(
        {
          userId,
          moduleId,
          missionId
        }
      );

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMissionByUserId(
        {
          userId,
          moduleId,
          missionId
        }
      );

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMissionByUserId({
        userId,
        moduleId,
        missionId
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
