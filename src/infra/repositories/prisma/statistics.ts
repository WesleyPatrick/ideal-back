import { CacheAdapter } from "@domain/adapters/cache";
import {
  StatisticResume,
  StatisticsBasicParams,
  StatisticsByServiceProviderIdParams,
  StatisticsByUserIdParams,
  StatisticsRepository
} from "@domain/repositories/statistics";
import { PrismaService } from "@infra/config/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaStatisticsRepository implements StatisticsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheAdapter
  ) {}

  async getAccuracyForModuleOrMissionByUserId({
    moduleId,
    userId,
    missionId
  }: StatisticsByUserIdParams): Promise<number> {
    const query = await this.prisma.$queryRaw<
      { accuracy_percentage: number }[]
    >(
      Prisma.sql`
      SELECT
        ROUND(((COUNT(*) FILTER (WHERE is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS accuracy_percentage
      FROM activity_attempts
      WHERE user_id = ${userId}
        AND ${missionId ? Prisma.sql`mission_id = ${missionId}` : Prisma.sql`module_id = ${moduleId}`}
    `
    );

    return query[0]?.accuracy_percentage ?? 0;
  }

  async getAvgCompletionTimeForModuleOrMissionByUserId({
    moduleId,
    userId,
    missionId
  }: StatisticsByUserIdParams): Promise<number> {
    const table = missionId
      ? Prisma.raw(`user_mission_conclusions`)
      : Prisma.raw(`user_module_conclusions`);
    const column = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<
      { avg_days_to_complete: number }[]
    >(
      Prisma.sql`
      SELECT
        ROUND(AVG(EXTRACT(DAY FROM finished_at - started_at))::numeric, 2) AS avg_days_to_complete
      FROM ${table}
      WHERE ${column} AND user_id = ${userId} AND finished_at IS NOT NULL
    `
    );

    return query[0]?.avg_days_to_complete ?? 0;
  }

  async getAveragePerformanceForModuleOrMissionByUserId({
    moduleId,
    userId,
    missionId
  }: StatisticsByUserIdParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<{ avg_performance: number }[]>(
      Prisma.sql`
      SELECT
        ROUND(((COUNT(*) FILTER (WHERE is_correct) * 100.0) / GREATEST(COUNT(*), 1))::numeric, 2) AS avg_performance
      FROM activity_attempts
      WHERE user_id = ${userId} AND ${filter}
    `
    );

    return query[0]?.avg_performance ?? 0;
  }

  async getErrorRateForModuleOrMissionByUserId({
    moduleId,
    userId,
    missionId
  }: StatisticsByUserIdParams): Promise<number> {
    const query = await this.prisma.$queryRaw<{ error_percentage: number }[]>(
      Prisma.sql`
      SELECT
        ROUND(((COUNT(*) FILTER (WHERE NOT is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS error_percentage
      FROM activity_attempts
      WHERE user_id = ${userId}
        AND ${missionId ? Prisma.sql`mission_id = ${missionId}` : Prisma.sql`module_id = ${moduleId}`}
    `
    );

    return query[0]?.error_percentage ?? 0;
  }

  async getAvgReturnTimeForModuleOrMissionByUserId(
    userId: string
  ): Promise<number> {
    const query = await this.prisma.$queryRaw<{ avg_days_to_return: number }[]>(
      Prisma.sql`
      WITH scoped_access AS (
        SELECT accessed_at
        FROM user_access_logs
        WHERE user_id = ${userId}
      )
      SELECT
        ROUND(AVG(EXTRACT(EPOCH FROM NOW() - accessed_at) / 86400)::numeric, 2) AS avg_days_to_return
      FROM scoped_access
    `
    );

    return query[0]?.avg_days_to_return ?? 0;
  }

  async getAccuracyForModuleOrMissionByServiceProviderId({
    moduleId,
    serviceProviderId,
    missionId
  }: StatisticsByServiceProviderIdParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<
      { accuracy_percentage: number }[]
    >(
      Prisma.sql`
      WITH scoped_users AS (
        SELECT u.id as user_id
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.service_provider_id = ${serviceProviderId}
      )
      SELECT
        ROUND(((COUNT(*) FILTER (WHERE is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS accuracy_percentage
      FROM activity_attempts
      WHERE ${filter}
        AND user_id IN (SELECT user_id FROM scoped_users)
    `
    );

    return query[0]?.accuracy_percentage ?? 0;
  }

  async getAvgCompletionTimeForModuleOrMissionByServiceProviderId({
    moduleId,
    serviceProviderId,
    missionId
  }: StatisticsByServiceProviderIdParams): Promise<number> {
    const table = missionId
      ? Prisma.raw(`user_mission_conclusions`)
      : Prisma.raw(`user_module_conclusions`);
    const column = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<
      { avg_days_to_complete: number }[]
    >(
      Prisma.sql`
      WITH scoped_users AS (
        SELECT u.id as user_id
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.service_provider_id = ${serviceProviderId}
      )
      SELECT
        ROUND(AVG(EXTRACT(DAY FROM finished_at - started_at))::numeric, 2) AS avg_days_to_complete
      FROM ${table}
      WHERE ${column}
        AND finished_at IS NOT NULL
        AND user_id IN (SELECT user_id FROM scoped_users)
    `
    );

    return query[0]?.avg_days_to_complete ?? 0;
  }

  async getAveragePerformanceForModuleOrMissionByServiceProviderId({
    moduleId,
    serviceProviderId,
    missionId
  }: StatisticsByServiceProviderIdParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<{ avg_performance: number }[]>(
      Prisma.sql`
      WITH scoped_users AS (
        SELECT u.id as user_id
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.service_provider_id = ${serviceProviderId}
      ),
      user_scores AS (
        SELECT
          user_id,
          COUNT(*) FILTER (WHERE is_correct) * 9.0 / GREATEST(COUNT(*), 1) AS performance
        FROM activity_attempts
        WHERE ${filter}
          AND user_id IN (SELECT user_id FROM scoped_users)
        GROUP BY user_id
      )
      SELECT ROUND(((AVG(performance) / 9.0) * 100)::numeric, 2) AS avg_performance
      FROM user_scores
    `
    );

    return query[0]?.avg_performance ?? 0;
  }

  async getErrorRateForModuleOrMissionByServiceProviderId({
    moduleId,
    serviceProviderId,
    missionId
  }: StatisticsByServiceProviderIdParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<{ error_percentage: number }[]>(
      Prisma.sql`
      WITH scoped_users AS (
        SELECT u.id as user_id
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.service_provider_id = ${serviceProviderId}
      )
      SELECT
        ROUND(((COUNT(*) FILTER (WHERE NOT is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS error_percentage
      FROM activity_attempts
      WHERE ${filter}
        AND user_id IN (SELECT user_id FROM scoped_users)
    `
    );

    return query[0]?.error_percentage ?? 0;
  }

  async getAvgReturnTimeForModuleOrMissionByServiceProviderId({
    moduleId,
    serviceProviderId,
    missionId
  }: StatisticsByServiceProviderIdParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<{ avg_days_to_return: number }[]>(
      Prisma.sql`
      WITH scoped_users AS (
        SELECT u.id as user_id
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.service_provider_id = ${serviceProviderId}
      ),
      filtered_attempts AS (
        SELECT DISTINCT user_id
        FROM activity_attempts
        WHERE ${filter}
          AND user_id IN (SELECT user_id FROM scoped_users)
      ),
      last_access_per_user AS (
        SELECT
          ual.user_id,
          MAX(ual.accessed_at) AS last_access
        FROM user_access_logs ual
        JOIN filtered_attempts fa ON fa.user_id = ual.user_id
        GROUP BY ual.user_id
      )
      SELECT
        ROUND(AVG(EXTRACT(EPOCH FROM NOW() - last_access) / 86400)::numeric, 2) AS avg_days_to_return
      FROM last_access_per_user
    `
    );

    return query[0]?.avg_days_to_return ?? 0;
  }

  async getStudentsCountAndConclusionForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<StatisticResume> {
    const query = await this.prisma.$queryRaw<
      { total_users: number; completion_rate: number }[]
    >(Prisma.sql`
      WITH scoped_users AS (
        SELECT DISTINCT "user_id"
        FROM "activity_attempts"
        WHERE ${missionId ? Prisma.sql`"mission_id" = ${missionId}` : Prisma.sql`"module_id" = ${moduleId}`}
      ),
      finished_users AS (
        SELECT DISTINCT "user_id"
        FROM ${Prisma.raw(missionId ? `"user_mission_conclusions"` : `"user_module_conclusions"`)}
        WHERE ${missionId ? Prisma.sql`"mission_id" = ${missionId}` : Prisma.sql`"module_id" = ${moduleId}`} 
          AND "finished_at" IS NOT NULL
      )
      SELECT
        (SELECT COUNT(*) FROM scoped_users) AS total_users,
        CASE
          WHEN (SELECT COUNT(*) FROM scoped_users) = 0 THEN 0
          ELSE ROUND((
            (SELECT COUNT(*) FROM finished_users)::decimal /
            (SELECT COUNT(*) FROM scoped_users)
          )::numeric * 100, 2)
        END AS completion_rate
    `);

    return {
      studentsCount: query[0]?.total_users ?? 0,
      conclusion: query[0]?.completion_rate ?? 0
    };
  }

  async getAccuracyForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<number> {
    const query = await this.prisma.$queryRaw<
      { accuracy_percentage: number }[]
    >(
      Prisma.sql`
        SELECT
          ROUND(((COUNT(*) FILTER (WHERE is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS accuracy_percentage
        FROM activity_attempts
        WHERE ${missionId ? Prisma.sql`"mission_id" = ${missionId}` : Prisma.sql`"module_id" = ${moduleId}`}
      `
    );

    return query[0]?.accuracy_percentage ?? 0;
  }

  async getAvgCompletionTimeForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<number> {
    const table = missionId
      ? Prisma.raw(`user_mission_conclusions`)
      : Prisma.raw(`user_module_conclusions`);
    const column = missionId
      ? Prisma.sql`"mission_id" = ${missionId}`
      : Prisma.sql`"module_id" = ${moduleId}`;

    const query = await this.prisma.$queryRaw<
      { avg_days_to_complete: number }[]
    >(
      Prisma.sql`
        SELECT
          ROUND(AVG(EXTRACT(DAY FROM finished_at - started_at))::numeric, 2) AS avg_days_to_complete
        FROM ${table}
        WHERE ${column} AND finished_at IS NOT NULL
      `
    );

    return query[0]?.avg_days_to_complete ?? 0;
  }

  async getAveragePerformanceForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<number> {
    const filter = missionId
      ? Prisma.sql`mission_id = ${missionId}`
      : Prisma.sql`module_id = ${moduleId}`;

    const query = await this.prisma.$queryRaw<{ avg_performance: number }[]>(
      Prisma.sql`
        WITH user_scores AS (
          SELECT
            user_id,
            COUNT(*) FILTER (WHERE is_correct) * 9.0 / GREATEST(COUNT(*), 1) AS performance
          FROM activity_attempts
          WHERE ${filter}
          GROUP BY user_id
        )
        SELECT ROUND(((AVG(performance) / 9.0) * 100)::numeric, 2) AS avg_performance
        FROM user_scores
      `
    );

    return query[0]?.avg_performance ?? 0;
  }

  async getErrorRateForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<number> {
    const query = await this.prisma.$queryRaw<{ error_percentage: number }[]>(
      Prisma.sql`
        SELECT
          ROUND(((COUNT(*) FILTER (WHERE NOT is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS error_percentage
        FROM activity_attempts
        WHERE ${missionId ? Prisma.sql`"mission_id" = ${missionId}` : Prisma.sql`"module_id" = ${moduleId}`}
      `
    );

    return query[0]?.error_percentage ?? 0;
  }

  async getAvgReturnTimeForModuleOrMission({
    moduleId,
    missionId
  }: StatisticsBasicParams): Promise<number> {
    const query = await this.prisma.$queryRaw<{ avg_days_to_return: number }[]>(
      Prisma.sql`
        WITH scoped_users AS (
          SELECT DISTINCT user_id
          FROM activity_attempts
          WHERE ${missionId ? Prisma.sql`"mission_id" = ${missionId}` : Prisma.sql`"module_id" = ${moduleId}`}
        ),
        last_access_per_user AS (
          SELECT
            ual.user_id,
            MAX(ual.accessed_at) AS last_access
          FROM user_access_logs ual
          JOIN scoped_users su ON su.user_id = ual.user_id
          GROUP BY ual.user_id
        )
        SELECT
          ROUND(AVG(EXTRACT(EPOCH FROM NOW() - last_access) / 86400)::numeric, 2) AS avg_days_to_return
        FROM last_access_per_user
      `
    );

    return query[0]?.avg_days_to_return ?? 0;
  }
}
