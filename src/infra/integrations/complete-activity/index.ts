import {
  CompleteActivityAdapter,
  CompleteActivityParams
} from "@domain/adapters/complete-activity";
import {
  ACTIVITY_ATTEMPT_JOB,
  ACTIVITY_QUEUE
} from "@infra/jobs/complete-activity";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class CompleteActivityIntegration implements CompleteActivityAdapter {
  constructor(@InjectQueue(ACTIVITY_QUEUE) private readonly queue: Queue) {}

  async completeActivity(params: CompleteActivityParams): Promise<void> {
    await this.queue.add(ACTIVITY_ATTEMPT_JOB, params);
  }
}
