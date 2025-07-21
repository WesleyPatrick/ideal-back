import { TestConclusion } from "@domain/entities/test-conclusion";
import { TestConclusion as PrismaTestConclusion } from "@prisma/client";

export class TestConclusionMapper {
  static toDomain(testConclusion: PrismaTestConclusion): TestConclusion {
    return {
      id: testConclusion.id,
      employeeId: testConclusion.employeeId,
      finalTestId: testConclusion.finalTestId,
      activitiesHit: testConclusion.activitiesHit,
      createdAt: testConclusion.createdAt
    };
  }

  static toPersistence(testConclusion: TestConclusion): PrismaTestConclusion {
    return {
      id: testConclusion.id,
      employeeId: testConclusion.employeeId,
      finalTestId: testConclusion.finalTestId,
      activitiesHit: testConclusion.activitiesHit,
      createdAt: testConclusion.createdAt
    };
  }
}
