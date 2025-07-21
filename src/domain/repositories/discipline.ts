import { Discipline } from "@domain/entities/discipline";
import { Mission } from "@domain/entities/mission";
import { Module } from "@domain/entities/module";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Injectable } from "@nestjs/common";

export interface CreateDisciplineParams {
  title: string;
  author: string;
  resume: string;
  operatorId: string;
  coverImage: string;
  moduleTitle: string;
  color?: string;
  missionTitles: string[];
}

export interface CreateDisciplineResponse {
  discipline: Discipline;
  moduleTitle: string;
  missionTitles: string[];
}

export interface EditDisciplineParams {
  title?: string;
  author?: string;
  resume?: string;
  coverImage?: string;
}

export interface DisciplineWithOperatorId extends Discipline {
  operatorId: string;
}

export interface FindAllDisciplineParams extends PaginatedParams {
  title?: string;
}

export type MissionWithRelations = Pick<Mission, "id" | "title" | "index">;

export type ModuleWithRelations = Pick<Module, "id" | "title" | "index"> & {
  missions: MissionWithRelations[];
};

export type DisciplineWithRelations = Pick<
  Discipline,
  | "id"
  | "title"
  | "author"
  | "resume"
  | "coverImage"
  | "createdAt"
  | "updatedAt"
> & {
  modules: ModuleWithRelations[];
};

export interface FindAllByOperatorIdNoPaginationResponse {
  disciplineId: string;
  disciplineName: string;
}

@Injectable()
export abstract class DisciplineRepository {
  abstract create(
    params: CreateDisciplineParams
  ): Promise<CreateDisciplineResponse>;

  abstract findAll(
    params: FindAllDisciplineParams
  ): Promise<PaginatedEntity<Discipline>>;

  abstract findById(disciplineId: string): Promise<Discipline | null>;
  abstract findByIdWithOperatorId(
    disciplineId: string
  ): Promise<DisciplineWithOperatorId | null>;

  abstract findByTitle(title: string): Promise<Discipline | null>;

  abstract edit(
    disciplineId: string,
    params: EditDisciplineParams
  ): Promise<Discipline>;

  abstract delete(disciplineId: string): Promise<boolean>;

  abstract findByIdWithRelations(
    disciplineId: string
  ): Promise<DisciplineWithRelations>;

  abstract findAllNoPagination(): Promise<Discipline[]>;

  abstract findByOperatorId(
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Discipline>>;

  abstract findAllByOperatorIdNoPagination(
    operatorId: string
  ): Promise<FindAllByOperatorIdNoPaginationResponse[]>;
}
