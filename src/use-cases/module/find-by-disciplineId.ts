import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Module } from "@domain/entities/module";
import { PaginatedEntity } from "@domain/entities/pagination";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

export interface FindModuleByDisciplineIdUseCaseParams {
  disciplineId: string;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class FindModuleByDisciplineIdUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: FindModuleByDisciplineIdUseCaseParams
  ): Promise<PaginatedEntity<Module> | void> {
    const { disciplineId, page = 1, pageSize = 10 } = params;

    const haveDisciplineWithThisID =
      await this.disciplineRepository.findById(disciplineId);

    if (!haveDisciplineWithThisID) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this id"
      });
    }

    return await this.moduleRepository.findAllByDisciplineId(disciplineId, {
      page,
      pageSize
    });
  }
}
