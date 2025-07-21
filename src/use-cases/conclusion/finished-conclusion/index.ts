import { ConclusionAdapter } from "@domain/adapters/conclusion";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ConclusionRepository } from "@domain/repositories/conclusion";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface FinishedConclusionUseCaseParams {
  userId: string;
  disciplineId?: string;
  moduleId?: string;
  missionId?: string;
  stepId?: string;
}

@Injectable()
export class FinishedConclusionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly conclusionRepository: ConclusionRepository,
    private readonly conclusionAdapter: ConclusionAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: FinishedConclusionUseCaseParams): Promise<void> {
    const { userId, disciplineId, missionId, moduleId, stepId } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const [
      userStepConclusion,
      userMissionConclusion,
      userModuleConclusion,
      userDisciplineConclusion
    ] = await Promise.all([
      stepId
        ? this.conclusionRepository.findUserStepConclusionByUserAndStepId({
            entityId: stepId,
            userId
          })
        : Promise.resolve(null),
      missionId
        ? this.conclusionRepository.findUserMissionConclusionByUserAndMissionId(
            {
              entityId: missionId,
              userId
            }
          )
        : Promise.resolve(null),
      moduleId
        ? this.conclusionRepository.findUserModuleConclusionByUserAndModuleId({
            entityId: moduleId,
            userId
          })
        : Promise.resolve(null),
      disciplineId
        ? this.conclusionRepository.findUserDisciplineConclusionByUserAndDisciplineId(
            {
              entityId: disciplineId,
              userId
            }
          )
        : Promise.resolve(null)
    ]);

    if (stepId && !userStepConclusion) {
      return this.exception.notFound({
        message: "Not found a user step conclusion with this user and step id"
      });
    }

    if (missionId && !userMissionConclusion) {
      return this.exception.notFound({
        message:
          "Not found a user mission conclusion with this user and mission id"
      });
    }

    if (moduleId && !userModuleConclusion) {
      return this.exception.notFound({
        message:
          "Not found a user module conclusion with this user and module id"
      });
    }

    if (disciplineId && !userDisciplineConclusion) {
      return this.exception.notFound({
        message:
          "Not found a user discipline conclusion with this user and discipline id"
      });
    }

    await this.conclusionAdapter.finishedUserConclusion({
      finishedAt: new Date(),
      userDisciplineConclusionId: userDisciplineConclusion?.id ?? null,
      userMissionConclusionId: userMissionConclusion?.id ?? null,
      userModuleConclusionId: userModuleConclusion?.id ?? null,
      userStepConclusionId: userStepConclusion?.id ?? null
    });
  }
}
