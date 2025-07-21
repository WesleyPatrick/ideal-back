import { UserStepConclusion } from "@domain/entities/user-step-conclusion";
import { UserStepConclusion as PrismaUserStepConclusion } from "@prisma/client";

export class UserStepConclusionMapper {
  static toDomain(
    userStepConclusion: PrismaUserStepConclusion
  ): UserStepConclusion {
    return {
      id: userStepConclusion.id,
      userId: userStepConclusion.userId,
      stepId: userStepConclusion.stepId,
      startedAt: userStepConclusion.startedAt,
      finishedAt: userStepConclusion.finishedAt
    };
  }

  static toPersistence(
    userStepConclusion: UserStepConclusion
  ): PrismaUserStepConclusion {
    return {
      id: userStepConclusion.id,
      userId: userStepConclusion.userId,
      stepId: userStepConclusion.stepId,
      startedAt: userStepConclusion.startedAt,
      finishedAt: userStepConclusion.finishedAt
    };
  }
}
