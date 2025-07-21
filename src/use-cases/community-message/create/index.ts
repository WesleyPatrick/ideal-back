import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EventType, SSEAdapter } from "@domain/adapters/sse";
import { CommunityMessage } from "@domain/entities/community-message";
import { CommunityRepository } from "@domain/repositories/community";
import {
  CommunityMessageRepository,
  CreateCommunityMessageParams
} from "@domain/repositories/community-message";
import { EmployeeRepository } from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

export interface CreateCommunityMessageUseCaseResponse
  extends CommunityMessage {
  fromUserAvatar: string | null;
  fromUserName: string;
}

@Injectable()
export class CreateCommunityMessageUseCase {
  constructor(
    private readonly communityMessageRepository: CommunityMessageRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly SSEAdapter: SSEAdapter
  ) {}

  async execute(
    params: CreateCommunityMessageParams
  ): Promise<CreateCommunityMessageUseCaseResponse | void> {
    const { communityId, content, fromUserId } = params;

    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return this.exceptionAdapter.notFound({
        message: "Not found a community with this id"
      });
    }

    const user = await this.employeeRepository.findByUserIdWithUser(fromUserId);

    if (!user) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee user with this id"
      });
    }

    if (user.employee.communityId !== communityId) {
      return this.exceptionAdapter.badRequest({
        message: "This employee does not belong to this community."
      });
    }

    const communityMessage = await this.communityMessageRepository.create({
      communityId,
      content,
      fromUserId
    });

    if (!communityMessage) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to send a community message"
      });
    }

    const communityEmployees =
      await this.employeeRepository.findAllByCommunityId({
        communityId,
        fromUserId
      });

    for (const employee of communityEmployees) {
      this.SSEAdapter.notifyUser({
        userId: employee.userId,
        eventType: EventType.NEW_MESSAGE,
        payload: communityMessage
      });
    }

    return {
      id: communityMessage.communityId,
      fromUserId,
      communityId,
      content,
      fromUserAvatar: user.avatar || null,
      fromUserName: user.name,
      createdAt: communityMessage.createdAt,
      updatedAt: communityMessage.updatedAt
    };
  }
}
