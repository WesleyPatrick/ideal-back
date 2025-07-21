import { DialogActivity } from "@domain/entities/dialog-activity";
import {
  DialogActivity as PrismaDialogActivity,
  Sentence as PrismaSentence
} from "@prisma/client";
import { SentenceMapper } from "./sentence-mapper";
import { DialogActivityComplete } from "@domain/repositories/finalTest";

export class DialogActivityMapper {
  static toDomain(dialogActivity: PrismaDialogActivity): DialogActivity {
    return {
      id: dialogActivity.id,
      solecasAmount: dialogActivity.solecasAmount,
      stepPosition: dialogActivity.stepPosition,
      stepId: dialogActivity.stepId,
      finalTestId: dialogActivity.finalTestId,
      createdAt: dialogActivity.createdAt,
      updatedAt: dialogActivity.updatedAt
    };
  }

  static toDomainWithSentences(
    dialogActivity: PrismaDialogActivity & { sentences: PrismaSentence[] }
  ): DialogActivityComplete {
    return {
      id: dialogActivity.id,
      solecasAmount: dialogActivity.solecasAmount,
      stepPosition: dialogActivity.stepPosition,
      stepId: dialogActivity.stepId,
      finalTestId: dialogActivity.finalTestId,
      createdAt: dialogActivity.createdAt,
      updatedAt: dialogActivity.updatedAt,
      sentences: dialogActivity.sentences.map(SentenceMapper.toDomain)
    };
  }

  static toPersistence(dialogActivity: DialogActivity): PrismaDialogActivity {
    return {
      id: dialogActivity.id,
      solecasAmount: dialogActivity.solecasAmount,
      stepPosition: dialogActivity.stepPosition,
      stepId: dialogActivity.stepId,
      finalTestId: dialogActivity.finalTestId,
      createdAt: dialogActivity.createdAt,
      updatedAt: dialogActivity.updatedAt
    };
  }
}
