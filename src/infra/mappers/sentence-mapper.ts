import { Sentence } from "@domain/entities/sentence";
import { SentencePersonIconEnum } from "@domain/entities/sentence-person-icon-enum";
import { Sentence as PrismaSentence } from "@prisma/client";

export class SentenceMapper {
  static toDomain(sentence: PrismaSentence): Sentence {
    return {
      id: sentence.id,
      person: sentence.person as SentencePersonIconEnum,
      index: sentence.index,
      text: sentence.text,
      dialogActivityId: sentence.dialogActivityId,
      createdAt: sentence.createdAt,
      updatedAt: sentence.updatedAt
    };
  }

  static toPersistence(sentence: Sentence): PrismaSentence {
    return {
      id: sentence.id,
      person: sentence.person as SentencePersonIconEnum,
      index: sentence.index,
      text: sentence.text,
      dialogActivityId: sentence.dialogActivityId,
      createdAt: sentence.createdAt,
      updatedAt: sentence.updatedAt
    };
  }
}
