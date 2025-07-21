import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Discipline } from "@domain/entities/discipline";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllDisciplineNoPagination {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(): Promise<Discipline[] | void> {
    const disciplines = await this.disciplineRepository.findAllNoPagination();

    if (!disciplines) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to find all disciplines"
      });
    }

    return disciplines;
  }
}
