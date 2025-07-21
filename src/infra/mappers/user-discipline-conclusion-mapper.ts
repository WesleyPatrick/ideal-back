import { UserDisciplineConclusion } from "@domain/entities/user-discipline-conclusion";
import { UserDisciplineConclusion as PrismaUserDisciplineConclusion } from "@prisma/client";

export class UserDisciplineConclusionMapper {
  static toDomain(
    userDisciplineConclusion: PrismaUserDisciplineConclusion
  ): UserDisciplineConclusion {
    return {
      id: userDisciplineConclusion.id,
      userId: userDisciplineConclusion.userId,
      disciplineId: userDisciplineConclusion.disciplineId,
      startedAt: userDisciplineConclusion.startedAt,
      finishedAt: userDisciplineConclusion.finishedAt
    };
  }

  static toPersistence(
    userDisciplineConclusion: UserDisciplineConclusion
  ): PrismaUserDisciplineConclusion {
    return {
      id: userDisciplineConclusion.id,
      userId: userDisciplineConclusion.userId,
      disciplineId: userDisciplineConclusion.disciplineId,
      startedAt: userDisciplineConclusion.startedAt,
      finishedAt: userDisciplineConclusion.finishedAt
    };
  }
}
