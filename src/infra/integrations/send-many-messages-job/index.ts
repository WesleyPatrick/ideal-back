import {
  SendManyMessagesJobAdapter,
  SendManyMessagesJobParams
} from "@domain/adapters/send-many-messages-job";
import {
  CHAT_QUEUE,
  SEND_MANY_MESSAGES_JOB
} from "@infra/jobs/send-many-messages-job";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class SendManyMessagesJobIntegration
  implements SendManyMessagesJobAdapter
{
  constructor(@InjectQueue(CHAT_QUEUE) private readonly queue: Queue) {}

  async sendManyMessagesJob(data: SendManyMessagesJobParams): Promise<void> {
    await this.queue.add(SEND_MANY_MESSAGES_JOB, data);
  }
}
