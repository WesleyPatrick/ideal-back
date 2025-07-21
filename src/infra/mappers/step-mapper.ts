import { Step } from "@domain/entities/step";
import { Step as PrismaStep } from "@prisma/client";

export class StepMapper {
  static toDomain(step: PrismaStep): Step {
    return {
      id: step.id,
      title: step.title,
      index: step.index,
      missionId: step.missionId,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt
    };
  }

  static toPersistence(step: Step): PrismaStep {
    return {
      id: step.id,
      title: step.title,
      index: step.index,
      missionId: step.missionId,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt
    };
  }
}
