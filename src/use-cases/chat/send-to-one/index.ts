import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EventType, SSEAdapter } from "@domain/adapters/sse";
import {
  ChatRepository,
  MessageResponse,
  SendMessageParams
} from "@domain/repositories/chat";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendMessageToOneUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly chatRepository: ChatRepository,
    private readonly sseAdapter: SSEAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(params: SendMessageParams): Promise<MessageResponse | void> {
    const { content, fromUserId, toUserId } = params;

    const fromUser = await this.userRepository.findById(fromUserId);

    if (!fromUser) {
      return this.exceptionAdapter.notFound({
        message: "Sender user not found"
      });
    }

    const toUser = await this.userRepository.findById(toUserId);

    if (!toUser) {
      return this.exceptionAdapter.notFound({
        message: "Recipient user not found"
      });
    }

    const newMessage = await this.chatRepository.sendMessage({
      content,
      fromUserId,
      toUserId
    });

    if (!newMessage) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to send a message"
      });
    }

    this.sseAdapter.notifyUser({
      userId: toUserId,
      eventType: EventType.NEW_MESSAGE,
      payload: newMessage
    });

    return newMessage;
  }
}
