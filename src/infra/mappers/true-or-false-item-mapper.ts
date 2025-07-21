import { TrueOrFalseItem } from "@domain/entities/true-or-false-item";
import { TrueOrFalseItem as PrismaTrueOrFalseItem } from "@prisma/client";

export class TrueOrFalseItemMapper {
  static toDomain(trueOrFalseItem: PrismaTrueOrFalseItem): TrueOrFalseItem {
    return {
      id: trueOrFalseItem.id,
      text: trueOrFalseItem.text,
      isTrue: trueOrFalseItem.isTrue,
      trueOrFalseActivityId: trueOrFalseItem.trueOrFalseActivityId,
      createdAt: trueOrFalseItem.createdAt,
      updatedAt: trueOrFalseItem.updatedAt
    };
  }

  static toPersistence(
    trueOrFalseItem: TrueOrFalseItem
  ): PrismaTrueOrFalseItem {
    return {
      id: trueOrFalseItem.id,
      text: trueOrFalseItem.text,
      isTrue: trueOrFalseItem.isTrue,
      trueOrFalseActivityId: trueOrFalseItem.trueOrFalseActivityId,
      createdAt: trueOrFalseItem.createdAt,
      updatedAt: trueOrFalseItem.updatedAt
    };
  }
}
