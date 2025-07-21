import { TestConclusion } from "@domain/entities/test-conclusion";
import { UserDailyMissionConclusion } from "@domain/entities/user-daily-mission-conclusion";
import { UserDailyMissionStepConclusion } from "@domain/entities/user-daily-mission-step-conclusion";
import { UserDisciplineConclusion } from "@domain/entities/user-discipline-conclusion";
import { UserMissionConclusion } from "@domain/entities/user-mission-conclusion";
import { UserModuleConclusion } from "@domain/entities/user-module-conclusion";
import { UserStepConclusion } from "@domain/entities/user-step-conclusion";
import {
  ConclusionRepository,
  CreateDailyMissionConclusionParams,
  CreateTestConclusionParams,
  CreateUserConclusionParams,
  FindTestConclusionParams,
  FindUserConclusionParams,
  FinishedUserConclusionParams
} from "@domain/repositories/conclusion";
import { PrismaService } from "@infra/config/prisma";
import { TestConclusionMapper } from "@infra/mappers/test-conclusion-mapper";
import { UserDialyMissionConclusionMapper } from "@infra/mappers/user-daily-mission-conclusion";
import { UserDialyMissionStepConclusionMapper } from "@infra/mappers/user-daily-mission-step-conclusion";
import { UserDisciplineConclusionMapper } from "@infra/mappers/user-discipline-conclusion-mapper";
import { UserMissionConclusionMapper } from "@infra/mappers/user-mission-conclusion-mapper";
import { UserModuleConclusionMapper } from "@infra/mappers/user-module-conclusion-mapper";
import { UserStepConclusionMapper } from "@infra/mappers/user-step-conclusion-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaConclusionRepository implements ConclusionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDailyMissionConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void> {
    const { entityId, userId } = params;

    await this.prisma.userDailyMissionConclusion.create({
      data: {
        dailyMissionId: entityId,
        userId
      }
    });
  }

  async createStepDailyMissionConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void> {
    const { entityId, userId } = params;

    await this.prisma.userDailyMissionStepConclusion.create({
      data: {
        stepId: entityId,
        userId
      }
    });
  }

  async findDailyMissionConclusion(
    params: FindUserConclusionParams
  ): Promise<UserDailyMissionConclusion | null> {
    const { entityId, userId } = params;

    const userDailyMission =
      await this.prisma.userDailyMissionConclusion.findUnique({
        where: {
          userId_dailyMissionId: {
            userId,
            dailyMissionId: entityId
          }
        }
      });

    if (!userDailyMission) {
      return null;
    }

    return UserDialyMissionConclusionMapper.toDomain(userDailyMission);
  }

  async findDailyMissionStepConclusion(
    params: FindUserConclusionParams
  ): Promise<UserDailyMissionStepConclusion | null> {
    const { entityId, userId } = params;

    const userDailyMissionStep =
      await this.prisma.userDailyMissionStepConclusion.findUnique({
        where: {
          userId_stepId: {
            userId,
            stepId: entityId
          }
        }
      });

    if (!userDailyMissionStep) {
      return null;
    }

    return UserDialyMissionStepConclusionMapper.toDomain(userDailyMissionStep);
  }

  async findUserTestConclusionByUserIdAndFinalTestId(
    params: FindTestConclusionParams
  ): Promise<TestConclusion | null> {
    const { employeeId, finalTestId } = params;

    const finalTestConclusion = await this.prisma.testConclusion.findUnique({
      where: {
        employeeId_finalTestId: {
          employeeId,
          finalTestId
        }
      }
    });

    if (!finalTestConclusion) {
      return null;
    }

    return TestConclusionMapper.toDomain(finalTestConclusion);
  }

  async createTestConclusion(
    params: CreateTestConclusionParams
  ): Promise<TestConclusion> {
    const { activitiesHit, employeeId, finalTestId } = params;

    const testConclusion = await this.prisma.testConclusion.create({
      data: {
        activitiesHit,
        employeeId,
        finalTestId
      }
    });

    return TestConclusionMapper.toDomain(testConclusion);
  }

  async createUserStepConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserStepConclusion> {
    const { entityId, startedAt, userId } = params;

    const userStepConclusion = await this.prisma.userStepConclusion.create({
      data: {
        userId,
        stepId: entityId,
        startedAt
      }
    });

    return UserStepConclusionMapper.toDomain(userStepConclusion);
  }

  async findUserStepConclusionByUserAndStepId(
    params: FindUserConclusionParams
  ): Promise<UserStepConclusion | null> {
    const { entityId, userId } = params;

    const userStepConclusion = await this.prisma.userStepConclusion.findUnique({
      where: {
        userId_stepId: {
          stepId: entityId,
          userId
        }
      }
    });

    if (!userStepConclusion) {
      return null;
    }

    return UserStepConclusionMapper.toDomain(userStepConclusion);
  }

  async finishedUserStepConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void> {
    const { finishedAt, userEntityConclusionId } = params;

    await this.prisma.userStepConclusion.update({
      where: {
        id: userEntityConclusionId
      },
      data: {
        finishedAt
      }
    });
  }

  async createUserMissionConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserMissionConclusion> {
    const { entityId, startedAt, userId } = params;

    const userMissionConclusion =
      await this.prisma.userMissionConclusion.create({
        data: {
          missionId: entityId,
          userId,
          startedAt
        }
      });

    return UserMissionConclusionMapper.toDomain(userMissionConclusion);
  }

  async findUserMissionConclusionByUserAndMissionId(
    params: FindUserConclusionParams
  ): Promise<UserMissionConclusion | null> {
    const { entityId, userId } = params;

    const userMissionConclusion =
      await this.prisma.userMissionConclusion.findUnique({
        where: {
          userId_missionId: {
            userId,
            missionId: entityId
          }
        }
      });

    if (!userMissionConclusion) {
      return null;
    }

    return UserMissionConclusionMapper.toDomain(userMissionConclusion);
  }

  async finishedUserMissionConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void> {
    const { finishedAt, userEntityConclusionId } = params;

    await this.prisma.userMissionConclusion.update({
      where: {
        id: userEntityConclusionId
      },
      data: {
        finishedAt
      }
    });
  }

  async createUserModuleConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserModuleConclusion> {
    const { entityId, startedAt, userId } = params;

    const userModuleConclusion = await this.prisma.userModuleConclusion.create({
      data: {
        userId,
        moduleId: entityId,
        startedAt
      }
    });

    return UserModuleConclusionMapper.toDomain(userModuleConclusion);
  }

  async findUserModuleConclusionByUserAndModuleId(
    params: FindUserConclusionParams
  ): Promise<UserModuleConclusion | null> {
    const { entityId, userId } = params;

    const userModuleConclusion =
      await this.prisma.userModuleConclusion.findUnique({
        where: {
          userId_moduleId: {
            moduleId: entityId,
            userId
          }
        }
      });

    if (!userModuleConclusion) {
      return null;
    }

    return UserModuleConclusionMapper.toDomain(userModuleConclusion);
  }

  async finishedUserModuleConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void> {
    const { finishedAt, userEntityConclusionId } = params;

    await this.prisma.userModuleConclusion.update({
      where: {
        id: userEntityConclusionId
      },
      data: {
        finishedAt
      }
    });
  }

  async createUserDisciplineConclusion(
    params: CreateUserConclusionParams
  ): Promise<UserDisciplineConclusion> {
    const { entityId, startedAt, userId } = params;

    const userDisciplineConclusion =
      await this.prisma.userDisciplineConclusion.create({
        data: {
          userId,
          disciplineId: entityId,
          startedAt
        }
      });

    return UserDisciplineConclusionMapper.toDomain(userDisciplineConclusion);
  }

  async findUserDisciplineConclusionByUserAndDisciplineId(
    params: FindUserConclusionParams
  ): Promise<UserDisciplineConclusion | null> {
    const { entityId, userId } = params;

    const userDisciplineConclusion =
      await this.prisma.userDisciplineConclusion.findUnique({
        where: {
          userId_disciplineId: {
            disciplineId: entityId,
            userId
          }
        }
      });

    if (!userDisciplineConclusion) {
      return null;
    }

    return UserDisciplineConclusionMapper.toDomain(userDisciplineConclusion);
  }

  async finishedUserDisciplineConclusion(
    params: FinishedUserConclusionParams
  ): Promise<void> {
    const { finishedAt, userEntityConclusionId } = params;

    await this.prisma.userDisciplineConclusion.update({
      where: {
        id: userEntityConclusionId
      },
      data: {
        finishedAt
      }
    });
  }
}
