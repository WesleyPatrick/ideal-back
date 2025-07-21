import { UserMissionConclusion } from "@domain/entities/user-mission-conclusion";
import { UserMissionConclusion as PrismaUserMissionConclusion } from "@prisma/client";

export class UserMissionConclusionMapper {
  static toDomain(
    userMissionConclusion: PrismaUserMissionConclusion
  ): UserMissionConclusion {
    return {
      id: userMissionConclusion.id,
      userId: userMissionConclusion.userId,
      missionId: userMissionConclusion.missionId,
      startedAt: userMissionConclusion.startedAt,
      finishedAt: userMissionConclusion.finishedAt
    };
  }

  static toPersistence(
    userMissionConclusion: UserMissionConclusion
  ): PrismaUserMissionConclusion {
    return {
      id: userMissionConclusion.id,
      userId: userMissionConclusion.userId,
      missionId: userMissionConclusion.missionId,
      startedAt: userMissionConclusion.startedAt,
      finishedAt: userMissionConclusion.finishedAt
    };
  }
}
