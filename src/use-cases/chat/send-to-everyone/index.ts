import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { SendManyMessagesJobAdapter } from "@domain/adapters/send-many-messages-job";
import { RoleValue } from "@domain/entities/roles";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface SendToEveryoneUseCaseParams {
  fromUserId: string;
  content: string;
}

@Injectable()
export class SendMessageToEveryoneUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly sendManyMessagesJobAdapter: SendManyMessagesJobAdapter
  ) {}

  async execute(params: SendToEveryoneUseCaseParams): Promise<void> {
    const { content, fromUserId } = params;

    const fromUser = await this.userRepository.findById(fromUserId);

    if (!fromUser) {
      return this.exceptionAdapter.notFound({
        message: "Not found a from user with this id"
      });
    }

    if (fromUser.role !== RoleValue.ADMIN) {
      return this.exceptionAdapter.badRequest({
        message: "From User is not a admin"
      });
    }

    const usersIds =
      await this.userRepository.findAllUsersIdWithoutMe(fromUserId);

    await this.sendManyMessagesJobAdapter.sendManyMessagesJob({
      content,
      fromUserId,
      toUserIds: usersIds.map((user) => user.id)
    });
  }
}
