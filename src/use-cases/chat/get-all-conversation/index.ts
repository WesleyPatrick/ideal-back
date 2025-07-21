import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  ChatRepository,
  GetAllConversationsParams,
  MessageResponse
} from "@domain/repositories/chat";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetAllConversationsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly chatRepository: ChatRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: GetAllConversationsParams
  ): Promise<PaginatedEntity<MessageResponse> | void> {
    const { userId, name, page, pageSize } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionAdapter.notFound({
        message: "Not found a user with this id"
      });
    }

    return await this.chatRepository.getAllConversations({
      userId,
      name,
      page,
      pageSize
    });
  }
}
