import { SendManyMessagesJobAdapter } from "@domain/adapters/send-many-messages-job";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface SendMessageToManyUseCaseParams {
  content: string;
  fromUserId: string;
  toUserIds: string[];
}

@Injectable()
export class SendMessageToManyUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly sendManyMessagesJobAdapter: SendManyMessagesJobAdapter
  ) {}

  async execute(params: SendMessageToManyUseCaseParams): Promise<void> {
    const { content, fromUserId, toUserIds } = params;

    const fromUser = await this.userRepository.findById(fromUserId);

    if (!fromUser) {
      return this.exceptionAdapter.notFound({
        message: "Not found a user with this fromUserId"
      });
    }

    for (const toUserId of toUserIds) {
      const toUser = await this.userRepository.findById(toUserId);

      if (!toUser) {
        return this.exceptionAdapter.notFound({
          message: `Not found a user with this id ${toUserId}`
        });
      }
    }

    await this.sendManyMessagesJobAdapter.sendManyMessagesJob({
      content,
      fromUserId,
      toUserIds
    });
  }
}
