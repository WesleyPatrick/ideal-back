import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EventType, SSEAdapter } from "@domain/adapters/sse";
import { ChatRepository } from "@domain/repositories/chat";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReadMessageUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly SSEAdapter: SSEAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(messagesIds: string[], toFromId: string): Promise<void> {
    for (const messageId of messagesIds) {
      const message = await this.chatRepository.findById(messageId);

      if (!message) {
        return this.exceptionAdapter.notFound({
          message: `Not found a message with this id: ${messageId}`
        });
      }
    }

    const messagesRead = await this.chatRepository.readMessages(messagesIds);

    if (!messagesRead) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to read messages"
      });
    }

    this.SSEAdapter.notifyUser({
      userId: toFromId,
      eventType: EventType.READ_MESSAGES,
      payload: messagesIds
    });
  }
}
