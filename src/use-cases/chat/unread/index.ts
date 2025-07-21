import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  ChatRepository,
  UnreadMessagesResponse
} from "@domain/repositories/chat";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UnreadMessageUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly chatRepository: ChatRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: string): Promise<UnreadMessagesResponse | void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionAdapter.notFound({
        message: "Not found user with this id"
      });
    }

    return await this.chatRepository.unread(userId);
  }
}
