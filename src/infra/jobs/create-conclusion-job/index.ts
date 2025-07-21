import { CreateUserConclusion } from "@domain/adapters/conclusion";
import {
  ConclusionRepository,
  CreateDailyMissionConclusionParams,
  CreateTestConclusionParams,
  CreateUserConclusionParams
} from "@domain/repositories/conclusion";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

export const CREATE_CONCLUSION_QUEUE = "create-conclusion-queue";
export const CREATE_USER_CONCLUSION_JOB = "create-user-conclusion-job";

@Processor(CREATE_CONCLUSION_QUEUE)
export class CreateConclusionJob extends WorkerHost {
  constructor(private readonly conclusionRepository: ConclusionRepository) {
    super();
  }

  async process(job: Job<CreateUserConclusion>): Promise<void> {
    const {
      startedAt,
      stepId,
      userId,
      disciplineId,
      missionId,
      moduleId,
      finalTest,
      dailyMissionId,
      stepDailyMissionId
    } = job.data;

    const promises = [];

    if (dailyMissionId) {
      promises.push(
        this.createUserDailyMissionConclusion({
          entityId: dailyMissionId,
          userId
        })
      );
    }

    if (stepDailyMissionId) {
      promises.push(
        this.createUserDailyMissionStepConclusion({
          entityId: stepDailyMissionId,
          userId
        })
      );
    }

    if (disciplineId) {
      promises.push(
        this.createUserDiscipline({ entityId: disciplineId, userId, startedAt })
      );
    }

    if (moduleId) {
      promises.push(
        this.createUserModuleConclusion({
          entityId: moduleId,
          userId,
          startedAt
        })
      );
    }

    if (missionId) {
      promises.push(
        this.createUserMissionConclusion({
          entityId: missionId,
          userId,
          startedAt
        })
      );
    }

    if (stepId) {
      promises.push(
        this.createUserStepConclusion({ entityId: stepId, userId, startedAt })
      );
    }

    if (finalTest) {
      promises.push(
        this.createUserTestConclusion({
          activitiesHit: finalTest.activitiesHit,
          employeeId: finalTest.employeeId,
          finalTestId: finalTest.finalTestId
        })
      );
    }

    await Promise.all(promises);
  }

  private async createUserDiscipline(
    params: CreateUserConclusionParams
  ): Promise<void> {
    const { entityId, startedAt, userId } = params;

    const userDisciplineConclusion =
      await this.conclusionRepository.findUserDisciplineConclusionByUserAndDisciplineId(
        {
          userId,
          entityId
        }
      );

    if (!userDisciplineConclusion) {
      await this.conclusionRepository.createUserDisciplineConclusion({
        entityId,
        startedAt,
        userId
      });
    }
  }

  private async createUserModuleConclusion(
    params: CreateUserConclusionParams
  ): Promise<void> {
    const { entityId, startedAt, userId } = params;

    const userModuleConclusion =
      await this.conclusionRepository.findUserModuleConclusionByUserAndModuleId(
        {
          entityId,
          userId
        }
      );

    if (!userModuleConclusion) {
      await this.conclusionRepository.createUserModuleConclusion({
        entityId,
        startedAt,
        userId
      });
    }
  }

  private async createUserMissionConclusion(
    params: CreateUserConclusionParams
  ): Promise<void> {
    const { entityId, startedAt, userId } = params;

    const userMissionConclusion =
      await this.conclusionRepository.findUserMissionConclusionByUserAndMissionId(
        {
          entityId,
          userId
        }
      );

    if (!userMissionConclusion) {
      await this.conclusionRepository.createUserMissionConclusion({
        entityId,
        startedAt,
        userId
      });
    }
  }

  private async createUserStepConclusion(
    params: CreateUserConclusionParams
  ): Promise<void> {
    const { entityId, startedAt, userId } = params;

    const userStepConclusion =
      await this.conclusionRepository.findUserStepConclusionByUserAndStepId({
        entityId,
        userId
      });

    if (!userStepConclusion) {
      await this.conclusionRepository.createUserStepConclusion({
        entityId,
        startedAt,
        userId
      });
    }
  }

  private async createUserTestConclusion(
    params: CreateTestConclusionParams
  ): Promise<void> {
    const { activitiesHit, employeeId, finalTestId } = params;

    const testConclusion =
      await this.conclusionRepository.findUserTestConclusionByUserIdAndFinalTestId(
        {
          employeeId,
          finalTestId
        }
      );

    if (!testConclusion) {
      await this.conclusionRepository.createTestConclusion({
        activitiesHit,
        employeeId,
        finalTestId
      });
    }
  }

  private async createUserDailyMissionConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void> {
    const { entityId, userId } = params;

    const userDailyMission =
      await this.conclusionRepository.findDailyMissionConclusion({
        entityId,
        userId
      });

    if (!userDailyMission) {
      await this.conclusionRepository.createDailyMissionConclusion({
        entityId,
        userId
      });
    }
  }

  private async createUserDailyMissionStepConclusion(
    params: CreateDailyMissionConclusionParams
  ): Promise<void> {
    const { entityId, userId } = params;

    const userDailyMissionStep =
      await this.conclusionRepository.findDailyMissionStepConclusion({
        entityId,
        userId
      });

    if (!userDailyMissionStep) {
      await this.conclusionRepository.createStepDailyMissionConclusion({
        entityId,
        userId
      });
    }
  }
}
