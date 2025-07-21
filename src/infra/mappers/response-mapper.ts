import { Response } from "@domain/entities/response";
import { Response as PrismaResponse } from "@prisma/client";

export class ResponseMapper {
  static toDomain(response: PrismaResponse): Response {
    return {
      id: response.id,
      text: response.text,
      isCorrect: response.isCorrect,
      multipleResponseActivityId: response.multipleResponseActivityId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    };
  }

  static toPersistence(response: Response): PrismaResponse {
    return {
      id: response.id,
      text: response.text,
      isCorrect: response.isCorrect,
      multipleResponseActivityId: response.multipleResponseActivityId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    };
  }
}
