import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";
import { StatisticResponse } from "./utils";

@Injectable()
export class FindStatisticsByModuleIdAndServiceProviderIdUseCase {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(
    moduleId: string,
    serviceProviderId: string
  ): Promise<StatisticResponse> {
    const accuracyPercentage =
      await this.statisticsRepository.getAccuracyForModuleOrMissionByServiceProviderId(
        {
          moduleId,
          serviceProviderId
        }
      );

    const avgDaysToComplete =
      await this.statisticsRepository.getAvgCompletionTimeForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId
        }
      );

    const avgPerformance =
      await this.statisticsRepository.getAveragePerformanceForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId
        }
      );

    const errorPercentage =
      await this.statisticsRepository.getErrorRateForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId
        }
      );

    const avgDaysToReturn =
      await this.statisticsRepository.getAvgReturnTimeForModuleOrMissionByServiceProviderId(
        {
          serviceProviderId,
          moduleId
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
