import { FinalTest } from "@domain/entities/final-test";
import { FinalTest as PrismaFinalTest } from "@prisma/client";

export class FinalTestMapper {
  static toDomain(finalTest: PrismaFinalTest): FinalTest {
    return {
      id: finalTest.id,
      missionId: finalTest.missionId,
      solecasAmount: finalTest.solecasAmount,
      createdAt: finalTest.createdAt,
      updatedAt: finalTest.updatedAt
    };
  }

  static toPersistence(finalTest: FinalTest): PrismaFinalTest {
    return {
      id: finalTest.id,
      missionId: finalTest.missionId,
      solecasAmount: finalTest.solecasAmount,
      createdAt: finalTest.createdAt,
      updatedAt: finalTest.updatedAt
    };
  }
}
