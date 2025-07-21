import { Injectable } from "@nestjs/common";

export interface StatisticResume {
  studentsCount: number;
  conclusion: number;
}

export interface StatisticsBasicParams {
  moduleId: string;
  missionId?: string;
}

export interface StatisticsByServiceProviderIdParams
  extends StatisticsBasicParams {
  serviceProviderId: string;
}

export interface StatisticsByUserIdParams extends StatisticsBasicParams {
  userId: string;
}

@Injectable()
export abstract class StatisticsRepository {
  abstract getStudentsCountAndConclusionForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<StatisticResume>;
  abstract getAccuracyForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<number>;
  abstract getAvgCompletionTimeForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<number>;
  abstract getAveragePerformanceForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<number>;
  abstract getErrorRateForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<number>;
  abstract getAvgReturnTimeForModuleOrMission(
    params: StatisticsBasicParams
  ): Promise<number>;

  abstract getAccuracyForModuleOrMissionByServiceProviderId(
    params: StatisticsByServiceProviderIdParams
  ): Promise<number>;
  abstract getAvgCompletionTimeForModuleOrMissionByServiceProviderId(
    params: StatisticsByServiceProviderIdParams
  ): Promise<number>;
  abstract getAveragePerformanceForModuleOrMissionByServiceProviderId(
    params: StatisticsByServiceProviderIdParams
  ): Promise<number>;
  abstract getErrorRateForModuleOrMissionByServiceProviderId(
    params: StatisticsByServiceProviderIdParams
  ): Promise<number>;
  abstract getAvgReturnTimeForModuleOrMissionByServiceProviderId(
    params: StatisticsByServiceProviderIdParams
  ): Promise<number>;

  abstract getAccuracyForModuleOrMissionByUserId(
    params: StatisticsByUserIdParams
  ): Promise<number>;
  abstract getAvgCompletionTimeForModuleOrMissionByUserId(
    params: StatisticsByUserIdParams
  ): Promise<number>;
  abstract getAveragePerformanceForModuleOrMissionByUserId(
    params: StatisticsByUserIdParams
  ): Promise<number>;
  abstract getErrorRateForModuleOrMissionByUserId(
    params: StatisticsByUserIdParams
  ): Promise<number>;
  abstract getAvgReturnTimeForModuleOrMissionByUserId(
    userId: string
  ): Promise<number>;
}
