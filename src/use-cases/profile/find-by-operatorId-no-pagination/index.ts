import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";
import { ProfileRepository, ProfileResume } from "@domain/repositories/profile";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindProfileByOperatorIdNoPaginationUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(operatorId: string): Promise<ProfileResume[] | void> {
    const operator =
      await this.operatorRepository.findByIdAndReturnOperator(operatorId);

    if (!operator) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    return await this.profileRepository.findByOperatorIdNoPagination(
      operatorId
    );
  }
}
