import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { PrismaService } from "@infra/config/prisma";
import { CompleteActivityIntegration } from "@infra/integrations/complete-activity";
import {
  ACTIVITY_QUEUE,
  MakeActivityAttemptJob
} from "@infra/jobs/complete-activity";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    BullModule.registerQueue({
      name: ACTIVITY_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    })
  ],
  providers: [
    PrismaService,
    MakeActivityAttemptJob,
    {
      useClass: CompleteActivityIntegration,
      provide: CompleteActivityAdapter
    }
  ],
  exports: [
    {
      useClass: CompleteActivityIntegration,
      provide: CompleteActivityAdapter
    }
  ]
})
export class ActivityCompleteModule {}
