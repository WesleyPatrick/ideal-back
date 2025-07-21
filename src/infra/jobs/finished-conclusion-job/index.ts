import { FinishedUserConclusion } from "@domain/adapters/conclusion";
import { ConclusionRepository } from "@domain/repositories/conclusion";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

export const FINISHED_CONCLUSION_QUEUE = "finished-conclusion-queue";
export const FINISHED_USER_CONCLUSION_JOB = "finished-user-conclusion-job";

@Processor(FINISHED_CONCLUSION_QUEUE)
export class FinishedConclusionJob extends WorkerHost {
  constructor(private readonly conclusionRepository: ConclusionRepository) {
    super();
  }

  async process(job: Job<FinishedUserConclusion>): Promise<void> {
    const {
      finishedAt,
      userDisciplineConclusionId,
      userMissionConclusionId,
      userModuleConclusionId,
      userStepConclusionId
    } = job.data;

    const promises = [];

    if (userDisciplineConclusionId) {
      promises.push(
        this.conclusionRepository.finishedUserDisciplineConclusion({
          userEntityConclusionId: userDisciplineConclusionId,
          finishedAt
        })
      );
    }

    if (userModuleConclusionId) {
      promises.push(
        this.conclusionRepository.finishedUserModuleConclusion({
          userEntityConclusionId: userModuleConclusionId,
          finishedAt
        })
      );
    }

    if (userMissionConclusionId) {
      promises.push(
        await this.conclusionRepository.finishedUserMissionConclusion({
          finishedAt,
          userEntityConclusionId: userMissionConclusionId
        })
      );
    }

    if (userStepConclusionId) {
      promises.push(
        await this.conclusionRepository.finishedUserStepConclusion({
          finishedAt,
          userEntityConclusionId: userStepConclusionId
        })
      );
    }

    await Promise.all(promises);
  }
}
