import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

import { SendManyMessagesJobAdapter } from "@domain/adapters/send-many-messages-job";
import { SendManyMessagesJobIntegration } from "@infra/integrations/send-many-messages-job";
import {
  CHAT_QUEUE,
  SendManyMessagesJob
} from "@infra/jobs/send-many-messages-job";
import { DatabaseModule } from "../database";
import { SSEModule } from "../sse";

@Module({
  imports: [
    BullModule.registerQueue({
      name: CHAT_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    }),
    DatabaseModule,
    SSEModule
  ],
  providers: [
    SendManyMessagesJob,
    {
      provide: SendManyMessagesJobAdapter,
      useClass: SendManyMessagesJobIntegration
    }
  ],
  exports: [
    {
      provide: SendManyMessagesJobAdapter,
      useClass: SendManyMessagesJobIntegration
    }
  ]
})
export class SendManyMessagesJobModule {}
