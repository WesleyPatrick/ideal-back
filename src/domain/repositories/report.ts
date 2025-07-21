import { Injectable } from "@nestjs/common";

export interface DefaultReportParams {
  operatorId: string;
  serviceProviderId?: string;
  employeeId?: string;
}

export interface ActiveUsersResponse {
  operatorName: string;
  serviceProviderName: string;
  employeeName: string;
  disciplineCount: number;
  moduleCount: number;
  missionCount: number;
  missionsConclusionCount: number;
  modulesConclusionCount: number;
  disciplinesConclusionCount: number;
  accuracy: string;
  lastAccess: string;
}

export interface MissionConclusionResponse {
  disciplineName: string;
  moduleName: string;
  missionName: string;
  studentsCount: number;
  conclusionCount: number;
  averageAccuracy: string;
  averageConclusionTime: number;
}

export interface SolecasResponse {
  operatorName: string;
  serviceProviderName: string;
  employeeName: string;
  activitiesHitCount: number;
  averageTest: string;
  actualSolecasCount: number;
  totalSolecasSpent: number;
}

@Injectable()
export abstract class ReportRepository {
  abstract activeUsers(
    params: DefaultReportParams
  ): Promise<ActiveUsersResponse[]>;
  abstract missionsConclusion(
    params: DefaultReportParams
  ): Promise<MissionConclusionResponse[]>;
  abstract solecas(params: DefaultReportParams): Promise<SolecasResponse[]>;
}
