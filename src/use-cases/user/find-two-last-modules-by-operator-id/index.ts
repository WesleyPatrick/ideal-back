import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";
import { CardModuleResponse, UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindTwoLastModulesByOperatorIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(operatorId: string): Promise<CardModuleResponse[] | void> {
    const operador = await this.operatorRepository.findById(operatorId);

    if (!operador) {
      return this.exception.notFound({
        message: "Not found a operator with this id"
      });
    }

    return await this.userRepository.findTwoLastModulesByOperatorId(operatorId);
  }
}
