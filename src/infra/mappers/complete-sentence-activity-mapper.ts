import { CompleteSentenceActivity } from "@domain/entities/complete-sentence-activity";
import {
  Gap as PrismaGap,
  CompleteSentenceActivity as PrismaCompleteSentenceActivity
} from "@prisma/client";
import { GapMapper } from "./gap-mapper";
import { CompleteSentenceActivityComplete } from "@domain/repositories/finalTest";

export class CompleteSentenceActivityMapper {
  static toDomain(
    completeSentenceActivity: PrismaCompleteSentenceActivity
  ): CompleteSentenceActivity {
    return {
      id: completeSentenceActivity.id,
      question: completeSentenceActivity.question,
      textParts: completeSentenceActivity.textParts,
      stepPosition: completeSentenceActivity.stepPosition,
      stepId: completeSentenceActivity.stepId,
      solecasAmount: completeSentenceActivity.solecasAmount,
      finalTestId: completeSentenceActivity.finalTestId,
      createdAt: completeSentenceActivity.createdAt,
      updatedAt: completeSentenceActivity.updatedAt
    };
  }

  static toDomainWithGaps(
    completeSentenceActivity: PrismaCompleteSentenceActivity & {
      gaps: PrismaGap[];
    }
  ): CompleteSentenceActivityComplete {
    return {
      id: completeSentenceActivity.id,
      question: completeSentenceActivity.question,
      textParts: completeSentenceActivity.textParts,
      stepPosition: completeSentenceActivity.stepPosition,
      stepId: completeSentenceActivity.stepId,
      solecasAmount: completeSentenceActivity.solecasAmount,
      finalTestId: completeSentenceActivity.finalTestId,
      createdAt: completeSentenceActivity.createdAt,
      updatedAt: completeSentenceActivity.updatedAt,
      gaps: completeSentenceActivity.gaps.map(GapMapper.toDomain)
    };
  }

  static toPersistence(
    completeSentenceActivity: CompleteSentenceActivity
  ): PrismaCompleteSentenceActivity {
    return {
      id: completeSentenceActivity.id,
      question: completeSentenceActivity.question,
      textParts: completeSentenceActivity.textParts,
      stepPosition: completeSentenceActivity.stepPosition,
      stepId: completeSentenceActivity.stepId,
      solecasAmount: completeSentenceActivity.solecasAmount,
      finalTestId: completeSentenceActivity.finalTestId,
      createdAt: completeSentenceActivity.createdAt,
      updatedAt: completeSentenceActivity.updatedAt
    };
  }
}
