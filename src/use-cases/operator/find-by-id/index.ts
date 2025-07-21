import { Injectable } from "@nestjs/common";
import {
  FindOperatorByIdReturn,
  OperatorRepository
} from "@domain/repositories/operator";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";

@Injectable()
export class FindOperatorByIdUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(operatorId: string): Promise<FindOperatorByIdReturn | void> {
    const operator = await this.operatorRepository.findById(operatorId);

    if (!operator) {
      return this.exceptionsAdapter.notFound({
        message: `Operator with ID ${operatorId} not found`
      });
    }

    return operator;
  }
}
