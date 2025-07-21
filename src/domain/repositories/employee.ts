import { Injectable } from "@nestjs/common";
import { User, UserWithEmployee } from "@domain/entities/base-user";
import { CreateUserParams } from "./user";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Employee } from "@domain/entities/employee";

export interface CreateEmployeeParams extends CreateUserParams {
  serviceProviderId?: string;
  profileId: string;
}

export interface FindAllEmployees extends PaginatedParams {
  serviceProviderId: string;
}

export interface FindAllEmployeesReturn {
  employeeId: string;
  name: string;
  avatar: string | null;
  solecas: number;
  profileName: string;
}

export interface FindAllEmployeeNoPaginationByServiceProviderIdResponse {
  id: string;
  userId: string;
  name: string;
}

export interface UpdateEmployeeParams {
  serviceProviderId?: string;
  profileId?: string;
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
}

export interface FindAllByCommunityIdParams {
  communityId: string;
  fromUserId: string;
}

export interface FindAllDisciplineByEmployeeIdResponse {
  disciplineId: string;
  disciplineTitle: string;
  disciplineColor: string;
  disciplineCover: string;
}

export interface FindEmployeeProfileResponse {
  operator: {
    name: string;
    state: string;
    city: string;
    cpnj: string;
    address: string;
  };
  employee: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    avatar: string;
  };
}

export interface CardResponse {
  moduleId: string;
  disciplineTitle: string;
  moduleName: string;
  missionsCount: number;
  completionPercentage: number;
  accuracyPercentage: number;
  lastAttempt: Date;
}

export type CardResponseWithoutLastAttempt = Omit<CardResponse, "lastAttempt">;

export interface FindDisciplineModulesParams extends PaginatedParams {
  employeeId: string;
  disciplineId: string;
}

export interface FindModuleTrailParams {
  moduleId: string;
  employeeId: string;
}

export interface FindModuleTrailResponse {
  disciplineId: string;
  disciplineName: string;
  moduleId: string;
  moduleName: string;
  missions: FindMissionsInModuleTrail[];
}

export interface FindMissionsInModuleTrail {
  missionId: string;
  missionIndex: number;
  missionName: string;
  missionVideoUrl: string | null;
  missionDialogActivityId: string | null;
  missionArticleFile: string;
  steps: StepAccess[];
  finalTest: FinalTestAccess;
}

export interface FinalTestAccess {
  id: string;
  finalTestSolecas: number;
  isComplete: boolean;
}

export interface StepAccess {
  stepId: string;
  stepIndex: number;
  isCompleted: boolean;
  activitiesCorrect: number;
  activitiesIncorrect: number;
}

export interface ProgressData {
  totalActivities: number;
  totalActivitiesDone: number;
}

@Injectable()
export abstract class EmployeeRepository {
  abstract createEmployee(params: CreateEmployeeParams): Promise<User | void>;
  abstract findByIdWithUser(id: string): Promise<UserWithEmployee | null>;
  abstract findByUserIdWithUser(
    userId: string
  ): Promise<UserWithEmployee | null>;
  abstract findAllPaginated(
    params: FindAllEmployees
  ): Promise<PaginatedEntity<FindAllEmployeesReturn>>;
  abstract findAllEmployeeNoPaginationByServiceProviderId(
    serviceProviderId: string
  ): Promise<FindAllEmployeeNoPaginationByServiceProviderIdResponse[]>;
  abstract findById(employeeId: string): Promise<Employee | null>;
  abstract update(
    employeeId: string,
    params: UpdateEmployeeParams
  ): Promise<Employee>;
  abstract findAllByCommunityId(
    params: FindAllByCommunityIdParams
  ): Promise<{ userId: string }[]>;
  abstract findAllDisciplineByEmployeeId(
    employeeId: string
  ): Promise<FindAllDisciplineByEmployeeIdResponse[]>;
  abstract findEmployeeProfile(
    employeeId: string
  ): Promise<FindEmployeeProfileResponse>;
  abstract findThreeLastModules(employeeId: string): Promise<CardResponse[]>;
  abstract findDisciplineModules(
    params: FindDisciplineModulesParams
  ): Promise<PaginatedEntity<CardResponseWithoutLastAttempt>>;
  abstract findModuleTrail(
    params: FindModuleTrailParams
  ): Promise<FindModuleTrailResponse>;
  abstract getUserProgressData(userId: string): Promise<ProgressData>;
}
