import {
  ConclusionAdapter,
  CreateUserConclusion,
  FinishedUserConclusion
} from "@domain/adapters/conclusion";
import {
  CREATE_CONCLUSION_QUEUE,
  CREATE_USER_CONCLUSION_JOB
} from "@infra/jobs/create-conclusion-job";
import {
  FINISHED_CONCLUSION_QUEUE,
  FINISHED_USER_CONCLUSION_JOB
} from "@infra/jobs/finished-conclusion-job";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class ConclusionIntegration implements ConclusionAdapter {
  constructor(
    @InjectQueue(CREATE_CONCLUSION_QUEUE)
    private readonly createConclusionQueue: Queue,
    @InjectQueue(FINISHED_CONCLUSION_QUEUE)
    private readonly finishedConclusionQueue: Queue
  ) {}

  async createUserConclusion(params: CreateUserConclusion): Promise<void> {
    await this.createConclusionQueue.add(CREATE_USER_CONCLUSION_JOB, params);
  }

  async finishedUserConclusion(params: FinishedUserConclusion): Promise<void> {
    await this.finishedConclusionQueue.add(
      FINISHED_USER_CONCLUSION_JOB,
      params
    );
  }
}
