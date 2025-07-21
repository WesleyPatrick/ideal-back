import { DailyMission } from "@domain/entities/daily-mission";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Injectable } from "@nestjs/common";
import { StepAccess } from "./employee";

export interface CreateDailyMissionParams {
  startAt: Date;
  endAt: Date;
  solecasAmount: number;
  missionId: string;
  profileId: string;
}

export interface FindAllDailyMissionsParams extends PaginatedParams {
  userId: string;
  profileId: string;
}

export interface FindDailyMissionTrail {
  dailyMissionId: string;
  missionId: string;
  missionIndex: number;
  missionName: string;
  missionVideoUrl: string | null;
  missionDialogActivityId: string | null;
  missionArticleFile: string;
  steps: StepAccess[];
}

export interface MissionProgressInDailyMissionParams {
  userId: string;
  missionId: string;
}

export interface StepProgressInDailyMissionParams {
  userId: string;
  stepId: string;
}

@Injectable()
export abstract class DailyMissionRepository {
  abstract create(params: CreateDailyMissionParams): Promise<DailyMission>;
  abstract findAllDailyMissions(
    params: FindAllDailyMissionsParams
  ): Promise<PaginatedEntity<DailyMission>>;
  abstract findById(dailyMissionId: string): Promise<DailyMission | null>;
  abstract findDailyMissionTrail(
    dailyMissionId: string,
    userId: string
  ): Promise<FindDailyMissionTrail>;
  abstract missionProgressInDailyMission(
    params: MissionProgressInDailyMissionParams
  ): Promise<number>;
  abstract stepProgressInDailyMission(
    params: StepProgressInDailyMissionParams
  ): Promise<number>;
}
