import { TestConclusion } from "@domain/entities/test-conclusion";
import { UserDailyMissionConclusion } from "@domain/entities/user-daily-mission-conclusion";
import { UserDailyMissionStepConclusion } from "@domain/entities/user-daily-mission-step-conclusion";
import { UserDisciplineConclusion } from "@domain/entities/user-discipline-conclusion";
import { UserMissionConclusion } from "@domain/entities/user-mission-conclusion";
import { UserModuleConclusion } from "@domain/entities/user-module-conclusion";
import { UserStepConclusion } from "@domain/entities/user-step-conclusion";
import { Injectable } from "@nestjs/common";

export interface CreateUserConclusionParams {
  userId: string;
  entityId: string;
  startedAt: Date;
}

export interface CreateTestConclusionParams {
  activitiesHit: number;
  employeeId: string;
  finalTestId: string;
}

export interface FindUserConclusionParams {
  userId: string;
  entityId: string;
}

export interface FindTestConclusionParams {
  employeeId: string;
  finalTestId: string;
}

export interface FinishedUserConclusionParams {
  userEntityConclusionId: string;
  finishedAt: Date;
}

export type CreateDailyMissionConclusionParams = Omit<
  CreateUserConclusionParams,
  "startedAt"
>;

@Injectable()
export abstract class ConclusionRepository {
  abstract createUserStepConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserStepConclusion>;
  abstract findUserStepConclusionByUserAndStepId(
    params: FindUserConclusionParams
  ): Promise<UserStepConclusion | null>;
  abstract finishedUserStepConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void>;

  abstract createUserMissionConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserMissionConclusion>;
  abstract findUserMissionConclusionByUserAndMissionId(
    params: FindUserConclusionParams
  ): Promise<UserMissionConclusion | null>;
  abstract finishedUserMissionConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void>;

  abstract createUserModuleConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserModuleConclusion>;
  abstract findUserModuleConclusionByUserAndModuleId(
    params: FindUserConclusionParams
  ): Promise<UserModuleConclusion | null>;
  abstract finishedUserModuleConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void>;

  abstract createUserDisciplineConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserDisciplineConclusion>;
  abstract findUserDisciplineConclusionByUserAndDisciplineId(
    params: FindUserConclusionParams
  ): Promise<UserDisciplineConclusion | null>;
  abstract finishedUserDisciplineConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void>;

  abstract createTestConclusion(
    params: CreateTestConclusionParams
  ): Promise<TestConclusion>;
  abstract findUserTestConclusionByUserIdAndFinalTestId(
    params: FindTestConclusionParams
  ): Promise<TestConclusion | null>;

  abstract createDailyMissionConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void>;
  abstract createStepDailyMissionConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void>;
  abstract findDailyMissionConclusion(
    params: FindUserConclusionParams
  ): Promise<UserDailyMissionConclusion | null>;
  abstract findDailyMissionStepConclusion(
    params: FindUserConclusionParams
  ): Promise<UserDailyMissionStepConclusion | null>;
}
