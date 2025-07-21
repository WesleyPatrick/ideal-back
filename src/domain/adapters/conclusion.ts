import { Injectable } from "@nestjs/common";

export interface CreateUserConclusion {
  userId: string;
  stepId?: string;
  missionId?: string;
  moduleId?: string;
  disciplineId?: string;
  finalTest?: {
    activitiesHit: number;
    employeeId: string;
    finalTestId: string;
  };
  dailyMissionId?: string;
  stepDailyMissionId?: string;
  startedAt: Date;
}

export interface FinishedUserConclusion {
  userStepConclusionId?: string;
  userMissionConclusionId?: string;
  userModuleConclusionId?: string;
  userDisciplineConclusionId?: string;
  finishedAt: Date;
}

@Injectable()
export abstract class ConclusionAdapter {
  abstract createUserConclusion(params: CreateUserConclusion): Promise<void>;
  abstract finishedUserConclusion(
    params: FinishedUserConclusion
  ): Promise<void>;
}
