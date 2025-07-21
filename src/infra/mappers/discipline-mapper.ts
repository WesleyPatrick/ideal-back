import { Discipline } from "@domain/entities/discipline";
import { Discipline as PrismaDiscipline } from "@prisma/client";

export class DisciplineMapper {
  static toDomain(discipline: PrismaDiscipline): Discipline {
    return {
      id: discipline.id,
      title: discipline.title,
      author: discipline.author,
      coverImage: discipline.coverImage,
      resume: discipline.resume,
      color: discipline.color,
      createdAt: discipline.createdAt,
      updatedAt: discipline.updatedAt
    };
  }

  static toPersistence(discipline: Discipline): PrismaDiscipline {
    return {
      id: discipline.id,
      title: discipline.title,
      author: discipline.author,
      coverImage: discipline.coverImage,
      resume: discipline.resume,
      color: discipline.color,
      createdAt: discipline.createdAt,
      updatedAt: discipline.updatedAt
    };
  }
}
