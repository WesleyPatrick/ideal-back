import { UserDailyMissionConclusion } from "@domain/entities/user-daily-mission-conclusion";
import { UserDailyMissionConclusion as PrismaUserDailyMissionConclusion } from "@prisma/client";

export class UserDialyMissionConclusionMapper {
  static toDomain(
    userDialyMissionConclusion: PrismaUserDailyMissionConclusion
  ): UserDailyMissionConclusion {
    return {
      id: userDialyMissionConclusion.id,
      userId: userDialyMissionConclusion.userId,
      dailyMissionId: userDialyMissionConclusion.dailyMissionId,
      createdAt: userDialyMissionConclusion.createdAt
    };
  }

  static toPersistence(
    userDialyMissionConclusion: UserDailyMissionConclusion
  ): PrismaUserDailyMissionConclusion {
    return {
      id: userDialyMissionConclusion.id,
      userId: userDialyMissionConclusion.userId,
      dailyMissionId: userDialyMissionConclusion.dailyMissionId,
      createdAt: userDialyMissionConclusion.createdAt
    };
  }
}
