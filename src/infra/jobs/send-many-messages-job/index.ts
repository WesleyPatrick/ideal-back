import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { SendManyMessagesJobParams } from "@domain/adapters/send-many-messages-job";
import { ChatRepository } from "@domain/repositories/chat";
import { EventType, SSEAdapter } from "@domain/adapters/sse";

export const CHAT_QUEUE = "chat-queue";
export const SEND_MANY_MESSAGES_JOB = "send-many-messages-job";

@Processor(CHAT_QUEUE)
export class SendManyMessagesJob extends WorkerHost {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly sseAdapter: SSEAdapter
  ) {
    super();
  }

  async process(job: Job<SendManyMessagesJobParams>): Promise<void> {
    const { content, fromUserId, toUserIds } = job.data;

    for (const toUserId of toUserIds) {
      const newMessage = await this.chatRepository.sendMessage({
        content,
        fromUserId,
        toUserId
      });

      this.sseAdapter.notifyUser({
        userId: toUserId,
        eventType: EventType.NEW_MESSAGE,
        payload: newMessage
      });
    }
  }
}
