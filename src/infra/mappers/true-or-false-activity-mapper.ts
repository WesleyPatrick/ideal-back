import { TrueOrFalseActivity } from "@domain/entities/true-or-false-activity";
import {
  TrueOrFalseActivity as PrismaTrueOrFalseActivity,
  TrueOrFalseItem as PrismaTrueOrFalseItem
} from "@prisma/client";
import { TrueOrFalseItemMapper } from "./true-or-false-item-mapper";
import { TrueOrFalseActivityComplete } from "@domain/repositories/finalTest";

export class TrueOrFalseActivityMapper {
  static toDomain(
    trueOrFalseActivity: PrismaTrueOrFalseActivity
  ): TrueOrFalseActivity {
    return {
      id: trueOrFalseActivity.id,
      question: trueOrFalseActivity.question,
      stepId: trueOrFalseActivity.stepId,
      stepPosition: trueOrFalseActivity.stepPosition,
      solecasAmount: trueOrFalseActivity.solecasAmount,
      finalTestId: trueOrFalseActivity.finalTestId,
      createdAt: trueOrFalseActivity.createdAt,
      updatedAt: trueOrFalseActivity.updatedAt
    };
  }

  static toDomainWithItems(
    trueOrFalseActivity: PrismaTrueOrFalseActivity & {
      items: PrismaTrueOrFalseItem[];
    }
  ): TrueOrFalseActivityComplete {
    return {
      id: trueOrFalseActivity.id,
      question: trueOrFalseActivity.question,
      stepId: trueOrFalseActivity.stepId,
      stepPosition: trueOrFalseActivity.stepPosition,
      solecasAmount: trueOrFalseActivity.solecasAmount,
      finalTestId: trueOrFalseActivity.finalTestId,
      createdAt: trueOrFalseActivity.createdAt,
      updatedAt: trueOrFalseActivity.updatedAt,
      trueOrFalseItems: trueOrFalseActivity.items.map(
        TrueOrFalseItemMapper.toDomain
      )
    };
  }

  static toPersistence(
    trueOrFalseActivity: TrueOrFalseActivity
  ): PrismaTrueOrFalseActivity {
    return {
      id: trueOrFalseActivity.id,
      question: trueOrFalseActivity.question,
      stepId: trueOrFalseActivity.stepId,
      stepPosition: trueOrFalseActivity.stepPosition,
      solecasAmount: trueOrFalseActivity.solecasAmount,
      finalTestId: trueOrFalseActivity.finalTestId,
      createdAt: trueOrFalseActivity.createdAt,
      updatedAt: trueOrFalseActivity.updatedAt
    };
  }
}
