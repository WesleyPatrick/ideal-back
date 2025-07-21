import { Module } from "@domain/entities/module";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Injectable } from "@nestjs/common";

export interface CreateModuleParams {
  disciplineId: string;
  index: number;
  title: string;
  missionsTitles: string[];
}

export interface CreateModuleResponse {
  module: Module;
  missionsTitles: string[];
}

export interface FindModuleByNameParams {
  disciplineId: string;
  moduleTitle: string;
}

export interface FindModuleByIndexParams {
  disciplineId: string;
  index: number;
}

export interface EditModuleMission {
  missionId: string;
  newMissionTitle: string;
}

export interface EditModuleParams {
  moduleId: string;
  newModuleTitle?: string;
  missions?: EditModuleMission[];
}

export interface FindByIdWithRelationsResponse {
  id: string;
  moduleName: string;
  disciplineName: string;
  missionCount: number;
  stepCount: number;
  activitiesCount: number;
}

@Injectable()
export abstract class ModuleRepository {
  abstract findById(moduleId: string): Promise<Module | null>;

  abstract delete(moduleId: string): Promise<boolean>;

  abstract create(params: CreateModuleParams): Promise<CreateModuleResponse>;

  abstract findByName(params: FindModuleByNameParams): Promise<Module | null>;

  abstract findByIndex(params: FindModuleByIndexParams): Promise<Module | null>;

  abstract edit(params: EditModuleParams): Promise<Module>;

  abstract findAllByDisciplineIdNoPagination(
    disciplineId: string
  ): Promise<Module[]>;

  abstract findAllByDisciplineId(
    disciplineId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Module>>;

  abstract findByIdWithRelations(
    moduleId: string
  ): Promise<FindByIdWithRelationsResponse | null>;
}
