import { UserDailyMissionStepConclusion } from "@domain/entities/user-daily-mission-step-conclusion";
import { UserDailyMissionStepConclusion as PrismaUserDailyMissionStepConclusion } from "@prisma/client";

export class UserDialyMissionStepConclusionMapper {
  static toDomain(
    userDialyMissionStepConclusion: PrismaUserDailyMissionStepConclusion
  ): UserDailyMissionStepConclusion {
    return {
      id: userDialyMissionStepConclusion.id,
      stepId: userDialyMissionStepConclusion.stepId,
      userId: userDialyMissionStepConclusion.userId
    };
  }

  static toPersistence(
    userDialyMissionStepConclusion: UserDailyMissionStepConclusion
  ): PrismaUserDailyMissionStepConclusion {
    return {
      id: userDialyMissionStepConclusion.id,
      stepId: userDialyMissionStepConclusion.stepId,
      userId: userDialyMissionStepConclusion.userId
    };
  }
}
