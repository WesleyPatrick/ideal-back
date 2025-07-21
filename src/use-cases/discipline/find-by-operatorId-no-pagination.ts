import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  DisciplineRepository,
  FindAllByOperatorIdNoPaginationResponse
} from "@domain/repositories/discipline";
import { OperatorRepository } from "@domain/repositories/operator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDisciplinesByOperatorIdNoPaginationUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    operatorId: string
  ): Promise<FindAllByOperatorIdNoPaginationResponse[] | void> {
    const operator = await this.operatorRepository.findById(operatorId);

    if (!operator) {
      return this.exceptionAdapter.notFound({
        message: "Operator not found"
      });
    }

    const disciplines =
      await this.disciplineRepository.findAllByOperatorIdNoPagination(
        operatorId
      );

    if (!disciplines) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to find all disciplines"
      });
    }

    return disciplines;
  }
}
