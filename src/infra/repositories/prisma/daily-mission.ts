import { DailyMission } from "@domain/entities/daily-mission";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  CreateDailyMissionParams,
  DailyMissionRepository,
  FindAllDailyMissionsParams,
  FindDailyMissionTrail,
  MissionProgressInDailyMissionParams,
  StepProgressInDailyMissionParams
} from "@domain/repositories/daily-mission";
import { PrismaService } from "@infra/config/prisma";
import { DailyMissionMapper } from "@infra/mappers/daily-mission-mapper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaDailyMissionRepository implements DailyMissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async stepProgressInDailyMission(
    params: StepProgressInDailyMissionParams
  ): Promise<number> {
    const { stepId, userId } = params;

    const progress = await this.prisma.$queryRaw<
      Array<{
        accuracyPercentage: number;
      }>
    >(Prisma.sql`
          SELECT
            ROUND(((COUNT(*) FILTER (WHERE is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS accuracyPercentage
          FROM activity_attempts
          WHERE 
            step_id = ${stepId} AND 
            user_id = ${userId} AND
            is_daily_mission = true
      `);

    return progress[0].accuracyPercentage;
  }
  async missionProgressInDailyMission(
    params: MissionProgressInDailyMissionParams
  ): Promise<number> {
    const { missionId, userId } = params;

    const progress = await this.prisma.$queryRaw<
      Array<{
        accuracyPercentage: number;
      }>
    >(Prisma.sql`
          SELECT
            ROUND(((COUNT(*) FILTER (WHERE is_correct)::decimal / GREATEST(COUNT(*), 1)) * 100)::numeric, 2) AS accuracyPercentage
          FROM activity_attempts
          WHERE 
            mission_id = ${missionId} AND 
            user_id = ${userId} AND
            is_daily_mission = true
      `);

    return progress[0].accuracyPercentage;
  }

  async findDailyMissionTrail(
    dailyMissionId: string,
    userId: string
  ): Promise<FindDailyMissionTrail> {
    const rawResults = await this.prisma.$queryRaw<
      Array<{
        daily_mission_id: string;
        mission_id: string;
        mission_index: number;
        mission_name: string;
        mission_video_url: string | null;
        mission_dialog_activity_id: string | null;
        mission_article_file: string | null;
        step_id: string;
        step_index: number;
        activities_correct: number;
        activities_incorrect: number;
        user_daily_mission_step_conclusion_id: string;
      }>
    >(
      Prisma.sql`
        SELECT
          dm.id as daily_mission_id,
          ms.id as mission_id,
          ms.index as mission_index,
          ms.title as mission_name,
          ms.initial_video as mission_video_url,
          ms.dialog_activity_id as mission_dialog_activity_id,
          ms.article_file as mission_article_file,
          s.id as step_id,
          s.index as step_index,
          COUNT(aa.id) FILTER (WHERE aa.is_correct = true AND aa.is_daily_mission = true) AS activities_correct,
          COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.is_daily_mission = true) AS activities_incorrect,
          udmsc.id AS user_daily_mission_step_conclusion_id
        FROM daily_missions dm
        INNER JOIN missions ms ON ms.id = dm.mission_id
        INNER JOIN steps s ON s.mission_id = ms.id
        LEFT JOIN activity_attempts aa ON aa.step_id = s.id AND aa.user_id = ${userId}
        LEFT JOIN user_daily_mission_step_conclusions udmsc ON udmsc.step_id = s.id AND udmsc.user_id = ${userId}
        WHERE dm.id = ${dailyMissionId}
        GROUP BY dm.id, ms.id, ms.index, ms.title, ms.initial_video, ms.dialog_activity_id, ms.article_file, s.id, s.index, udmsc.id
        ORDER BY s.index ASC
      `
    );

    const firstRow = rawResults[0];

    return {
      dailyMissionId: firstRow.daily_mission_id,
      missionId: firstRow.mission_id,
      missionIndex: firstRow.mission_index,
      missionName: firstRow.mission_name,
      missionVideoUrl: firstRow.mission_video_url,
      missionDialogActivityId: firstRow.mission_dialog_activity_id,
      missionArticleFile: firstRow.mission_article_file ?? "",
      steps: rawResults.map((row) => ({
        stepId: row.step_id,
        stepIndex: row.step_index,
        activitiesCorrect: Number(row.activities_correct),
        activitiesIncorrect: Number(row.activities_incorrect),
        isCompleted: !!row.user_daily_mission_step_conclusion_id
      }))
    };
  }

  async findById(dailyMissionId: string): Promise<DailyMission | null> {
    const dailyMission = await this.prisma.dailyMission.findUnique({
      where: {
        id: dailyMissionId
      }
    });

    if (!dailyMission) {
      return null;
    }

    return DailyMissionMapper.toDomain(dailyMission);
  }
  async findAllDailyMissions(
    params: FindAllDailyMissionsParams
  ): Promise<PaginatedEntity<DailyMission>> {
    const { profileId, userId, page = 1, pageSize = 10 } = params;
    const now = new Date();
    const skip = (page - 1) * pageSize;

    const [total, dailyMissions] = await this.prisma.$transaction([
      this.prisma.dailyMission.count({
        where: {
          profileId,
          endAt: { gte: now },
          UserDailyMissionConclusion: {
            none: { userId }
          }
        }
      }),
      this.prisma.dailyMission.findMany({
        where: {
          profileId,
          endAt: { gte: now },
          UserDailyMissionConclusion: {
            none: { userId }
          }
        },
        skip,
        take: pageSize,
        orderBy: { startAt: "asc" }
      })
    ]);

    return {
      data: dailyMissions.map(DailyMissionMapper.toDomain),
      page,
      total,
      lastPage: Math.ceil(total / pageSize)
    };
  }

  async create(params: CreateDailyMissionParams): Promise<DailyMission> {
    const { endAt, missionId, profileId, solecasAmount, startAt } = params;

    const dailyMission = await this.prisma.dailyMission.create({
      data: {
        endAt,
        missionId,
        profileId,
        solecasAmount,
        startAt
      }
    });

    return DailyMissionMapper.toDomain(dailyMission);
  }
}
