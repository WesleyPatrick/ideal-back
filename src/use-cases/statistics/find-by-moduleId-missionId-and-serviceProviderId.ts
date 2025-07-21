import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

export interface FindStatisticsByServiceProviderIdParams {
  moduleId: string;
  missionId: string;
  serviceProviderId: string;
}

@Injectable()
export class FindStatisticsByModuleIdAndMissionByServiceProviderIdUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute({
    missionId,
    moduleId,
    serviceProviderId
  }: FindStatisticsByServiceProviderIdParams): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId,
          missionId
        }
      );

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId,
          missionId
        }
      );

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId,
          missionId
        }
      );

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId,
          missionId
        }
      );

    const avgDaysToReturn =
      await this.statisticsRepository.getAvgReturnTimeForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId,
          missionId
        }
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
