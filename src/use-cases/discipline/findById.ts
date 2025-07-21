import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  DisciplineRepository,
  DisciplineWithOperatorId
} from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDisciplineByIdUseCase {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    disciplineId: string
  ): Promise<DisciplineWithOperatorId | void> {
    const discipline =
      await this.disciplineRepository.findByIdWithOperatorId(disciplineId);

    if (!discipline) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this id"
      });
    }

    return discipline;
  }
}
