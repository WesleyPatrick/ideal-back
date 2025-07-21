import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Discipline } from "@domain/entities/discipline";
import { PaginatedEntity } from "@domain/entities/pagination";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

interface findAllDisciplinesUseCaseParams {
  page?: number;
  pageSize?: number;
  title?: string;
}

@Injectable()
export class FindAllDisciplinesUseCase {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: findAllDisciplinesUseCaseParams
  ): Promise<PaginatedEntity<Discipline> | void> {
    const { page = 1, pageSize = 10, title } = params;

    const data = await this.disciplineRepository.findAll({
      page,
      pageSize,
      title
    });

    if (!data) {
      return this.exceptionAdapter.internalServerError({
        message: "Internal server error"
      });
    }

    return data;
  }
}
