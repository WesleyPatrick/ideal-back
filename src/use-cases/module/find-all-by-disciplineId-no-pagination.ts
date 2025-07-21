import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Module } from "@domain/entities/module";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllModulesByDisciplineId {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly disciplineRepository: DisciplineRepository
  ) {}

  async execute(disciplineId: string): Promise<Module[] | void> {
    const haveDisciplineWithThisId =
      await this.disciplineRepository.findById(disciplineId);

    if (!haveDisciplineWithThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this id"
      });
    }

    return await this.moduleRepository.findAllByDisciplineIdNoPagination(
      disciplineId
    );
  }
}
