import { DailyMission } from "@domain/entities/daily-mission";
import { DailyMission as PrismaDailyMission } from "@prisma/client";

export class DailyMissionMapper {
  static toDomain(diaryMission: PrismaDailyMission): DailyMission {
    return {
      id: diaryMission.id,
      startAt: diaryMission.startAt,
      endAt: diaryMission.endAt,
      solecasAmount: diaryMission.solecasAmount,
      missionId: diaryMission.missionId,
      profileId: diaryMission.profileId,
      createdAt: diaryMission.createdAt,
      updatedAt: diaryMission.updatedAt
    };
  }

  static toPersistence(diaryMission: DailyMission): PrismaDailyMission {
    return {
      id: diaryMission.id,
      startAt: diaryMission.startAt,
      endAt: diaryMission.endAt,
      solecasAmount: diaryMission.solecasAmount,
      missionId: diaryMission.missionId,
      profileId: diaryMission.profileId,
      createdAt: diaryMission.createdAt,
      updatedAt: diaryMission.updatedAt
    };
  }
}
