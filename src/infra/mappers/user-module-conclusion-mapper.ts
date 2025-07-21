import { UserModuleConclusion } from "@domain/entities/user-module-conclusion";
import { UserModuleConclusion as PrismaUserModuleConclusion } from "@prisma/client";

export class UserModuleConclusionMapper {
  static toDomain(
    userModuleConclusion: PrismaUserModuleConclusion
  ): UserModuleConclusion {
    return {
      id: userModuleConclusion.id,
      userId: userModuleConclusion.userId,
      moduleId: userModuleConclusion.moduleId,
      startedAt: userModuleConclusion.startedAt,
      finishedAt: userModuleConclusion.finishedAt
    };
  }

  static toPersistence(
    userModuleConclusion: UserModuleConclusion
  ): PrismaUserModuleConclusion {
    return {
      id: userModuleConclusion.id,
      userId: userModuleConclusion.userId,
      moduleId: userModuleConclusion.moduleId,
      startedAt: userModuleConclusion.startedAt,
      finishedAt: userModuleConclusion.finishedAt
    };
  }
}
