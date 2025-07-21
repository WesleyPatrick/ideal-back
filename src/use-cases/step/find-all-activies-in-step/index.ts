import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { RoleValue } from "@domain/entities/roles";
import {
  FindAllActivitiesByStepIdResponse,
  StepRepository
} from "@domain/repositories/step";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllActivitiesInStepUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly stepRepository: StepRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    stepId: string,
    userId: string
  ): Promise<FindAllActivitiesByStepIdResponse | void> {
    const step = await this.stepRepository.findById(stepId);

    if (!step) {
      return this.exception.notFound({
        message: "Not found a step with this id"
      });
    }

    const user = await this.userRepository.findById(userId);

    if (!user || user.role !== RoleValue.EMPLOYEE) {
      return this.exception.notFound({
        message: "Not found a employee user with this id"
      });
    }

    return await this.stepRepository.findAllActivitiesByStepId(stepId, userId);
  }
}
