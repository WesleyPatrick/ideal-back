import { MultipleResponseActivity } from "@domain/entities/multiple-response-activity";
import {
  MultipleResponseActivity as PrismaMultipleResponseActivity,
  Response as PrismaResponse
} from "@prisma/client";
import { ResponseMapper } from "./response-mapper";
import { MultipleResponseActivityComplete } from "@domain/repositories/finalTest";

export class MultipleResponseActivityMapper {
  static toDomain(
    multipleResponseActivity: PrismaMultipleResponseActivity
  ): MultipleResponseActivity {
    return {
      id: multipleResponseActivity.id,
      question: multipleResponseActivity.question,
      solecasAmount: multipleResponseActivity.solecasAmount,
      stepPosition: multipleResponseActivity.stepPosition,
      stepId: multipleResponseActivity.stepId,
      finalTestId: multipleResponseActivity.finalTestId,
      createdAt: multipleResponseActivity.createdAt,
      updatedAt: multipleResponseActivity.updatedAt
    };
  }

  static toDomainWithResponses(
    multipleResponseActivity: PrismaMultipleResponseActivity & {
      responses: PrismaResponse[];
    }
  ): MultipleResponseActivityComplete {
    return {
      id: multipleResponseActivity.id,
      question: multipleResponseActivity.question,
      solecasAmount: multipleResponseActivity.solecasAmount,
      stepPosition: multipleResponseActivity.stepPosition,
      stepId: multipleResponseActivity.stepId,
      finalTestId: multipleResponseActivity.finalTestId,
      createdAt: multipleResponseActivity.createdAt,
      updatedAt: multipleResponseActivity.updatedAt,
      responses: multipleResponseActivity.responses.map(ResponseMapper.toDomain)
    };
  }

  static toPersistence(
    multipleResponseActivity: MultipleResponseActivity
  ): PrismaMultipleResponseActivity {
    return {
      id: multipleResponseActivity.id,
      question: multipleResponseActivity.question,
      solecasAmount: multipleResponseActivity.solecasAmount,
      stepPosition: multipleResponseActivity.stepPosition,
      stepId: multipleResponseActivity.stepId,
      finalTestId: multipleResponseActivity.finalTestId,
      createdAt: multipleResponseActivity.createdAt,
      updatedAt: multipleResponseActivity.updatedAt
    };
  }
}
