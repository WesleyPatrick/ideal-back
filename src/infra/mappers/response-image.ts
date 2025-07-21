import { ResponseImage } from "@domain/entities/response-image";
import { ResponseImage as PrismaResponseImage } from "@prisma/client";

export class ResponseImageMapper {
  static toDomain(responseImage: PrismaResponseImage): ResponseImage {
    return {
      id: responseImage.id,
      imageFile: responseImage.imageFile,
      isCorrect: responseImage.isCorrect,
      imageActivityId: responseImage.imageActivityId,
      createdAt: responseImage.createdAt,
      updatedAt: responseImage.updatedAt
    };
  }

  static toPersistence(responseImage: ResponseImage): PrismaResponseImage {
    return {
      id: responseImage.id,
      imageFile: responseImage.imageFile,
      isCorrect: responseImage.isCorrect,
      imageActivityId: responseImage.imageActivityId,
      createdAt: responseImage.createdAt,
      updatedAt: responseImage.updatedAt
    };
  }
}
