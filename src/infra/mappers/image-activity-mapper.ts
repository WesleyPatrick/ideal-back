import { ImageActivity } from "@domain/entities/image-activity";
import {
  ImageActivity as PrismaImageActivity,
  ResponseImage as PrismaResponseImage
} from "@prisma/client";
import { ResponseImageMapper } from "./response-image";
import { ImageActivityComplete } from "@domain/repositories/finalTest";

export class ImageActivityMapper {
  static toDomain(imageActivity: PrismaImageActivity): ImageActivity {
    return {
      id: imageActivity.id,
      question: imageActivity.question,
      stepPosition: imageActivity.stepPosition,
      solecasAmount: imageActivity.solecasAmount,
      stepId: imageActivity.stepId,
      finalTestId: imageActivity.finalTestId,
      createdAt: imageActivity.createdAt,
      updatedAt: imageActivity.updatedAt
    };
  }

  static toDomainWithResponses(
    imageActivity: PrismaImageActivity & { responses: PrismaResponseImage[] }
  ): ImageActivityComplete {
    return {
      id: imageActivity.id,
      question: imageActivity.question,
      stepPosition: imageActivity.stepPosition,
      solecasAmount: imageActivity.solecasAmount,
      stepId: imageActivity.stepId,
      finalTestId: imageActivity.finalTestId,
      createdAt: imageActivity.createdAt,
      updatedAt: imageActivity.updatedAt,
      responseImages: imageActivity.responses.map(ResponseImageMapper.toDomain)
    };
  }

  static toPersistence(imageActivity: ImageActivity): PrismaImageActivity {
    return {
      id: imageActivity.id,
      question: imageActivity.question,
      stepPosition: imageActivity.stepPosition,
      solecasAmount: imageActivity.solecasAmount,
      stepId: imageActivity.stepId,
      finalTestId: imageActivity.finalTestId,
      createdAt: imageActivity.createdAt,
      updatedAt: imageActivity.updatedAt
    };
  }
}
