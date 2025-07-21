import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import {
  CREATE_CONCLUSION_QUEUE,
  CreateConclusionJob
} from "@infra/jobs/create-conclusion-job";
import {
  FINISHED_CONCLUSION_QUEUE,
  FinishedConclusionJob
} from "@infra/jobs/finished-conclusion-job";
import { ConclusionAdapter } from "@domain/adapters/conclusion";
import { ConclusionIntegration } from "@infra/integrations/conclusion";

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_CONCLUSION_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    }),
    BullModule.registerQueue({
      name: FINISHED_CONCLUSION_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    }),
    DatabaseModule
  ],
  providers: [
    CreateConclusionJob,
    FinishedConclusionJob,
    {
      provide: ConclusionAdapter,
      useClass: ConclusionIntegration
    }
  ],
  exports: [
    {
      provide: ConclusionAdapter,
      useClass: ConclusionIntegration
    }
  ]
})
export class ConclusionAdapterModule {}
