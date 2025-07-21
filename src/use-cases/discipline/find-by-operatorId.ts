import { Discipline } from "@domain/entities/discipline";
import { PaginatedEntity } from "@domain/entities/pagination";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

export interface FindDisciplineByOperatorIdUseCaseParams {
  operatorId: string;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class FindDisciplineByOperatorIdUseCase {
  constructor(private readonly disciplineRepository: DisciplineRepository) {}

  async execute(
    params: FindDisciplineByOperatorIdUseCaseParams
  ): Promise<PaginatedEntity<Discipline>> {
    const { operatorId, page = 1, pageSize = 10 } = params;

    return await this.disciplineRepository.findByOperatorId(operatorId, {
      page,
      pageSize
    });
  }
}
