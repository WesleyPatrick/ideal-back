import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  ChatRepository,
  GetConversationParams,
  MessageResponse
} from "@domain/repositories/chat";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetConversationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly chatRepository: ChatRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: GetConversationParams
  ): Promise<PaginatedEntity<MessageResponse> | void> {
    const { fromUserId, page, pageSize, toUserId } = params;

    const fromUser = await this.userRepository.findById(fromUserId);

    if (!fromUser) {
      return this.exceptionAdapter.notFound({
        message: `Not found a user with this id: ${fromUserId}`
      });
    }

    const toUser = await this.userRepository.findById(toUserId);

    if (!toUser) {
      return this.exceptionAdapter.notFound({
        message: `Not found a user with this id: ${toUserId}`
      });
    }

    return await this.chatRepository.getConversation({
      toUserId,
      fromUserId,
      page,
      pageSize
    });
  }
}
