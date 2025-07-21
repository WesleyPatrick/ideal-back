import { Mission } from "@domain/entities/mission";
import { Mission as PrismaMission } from "@prisma/client";

export class MissionMapper {
  static toDomain(mission: PrismaMission): Mission {
    return {
      id: mission.id,
      title: mission.title,
      initialVideo: mission.initialVideo,
      articleFile: mission.articleFile,
      dialogActivityId: mission.dialogActivityId,
      index: mission.index,
      color: mission.color,
      moduleId: mission.moduleId,
      createdAt: mission.createdAt,
      updatedAt: mission.updatedAt
    };
  }

  static toPersistence(mission: Mission): PrismaMission {
    return {
      id: mission.id,
      title: mission.title,
      initialVideo: mission.initialVideo,
      articleFile: mission.articleFile,
      index: mission.index,
      color: mission.color,
      moduleId: mission.moduleId,
      dialogActivityId: mission.dialogActivityId,
      createdAt: mission.createdAt,
      updatedAt: mission.updatedAt
    };
  }
}
