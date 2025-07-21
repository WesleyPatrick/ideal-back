import { Gap } from "@domain/entities/gap";
import { Gap as PrismaGap } from "@prisma/client";

export class GapMapper {
  static toDomain(gap: PrismaGap): Gap {
    return {
      id: gap.id,
      index: gap.index,
      options: gap.options,
      correct: gap.correct,
      completeSentenceActivityId: gap.completeSentenceActivityId,
      createdAt: gap.createdAt,
      updatedAt: gap.updatedAt
    };
  }

  static toPersistence(gap: Gap): PrismaGap {
    return {
      id: gap.id,
      index: gap.index,
      options: gap.options,
      correct: gap.correct,
      completeSentenceActivityId: gap.completeSentenceActivityId,
      createdAt: gap.createdAt,
      updatedAt: gap.updatedAt
    };
  }
}
