import { CommunityMessage } from "@domain/entities/community-message";
import { CommunityMessage as PrismaCommunityMessage } from "@prisma/client";

export class CommunityMessagesMapper {
  static toDomain(communityMessages: PrismaCommunityMessage): CommunityMessage {
    return {
      id: communityMessages.id,
      fromUserId: communityMessages.fromUserId,
      communityId: communityMessages.communityId,
      content: communityMessages.content,
      readAt: communityMessages.readAt,
      createdAt: communityMessages.createdAt,
      updatedAt: communityMessages.updatedAt
    };
  }

  static toPersistence(
    communityMessages: CommunityMessage
  ): PrismaCommunityMessage {
    return {
      id: communityMessages.id,
      fromUserId: communityMessages.fromUserId,
      communityId: communityMessages.communityId,
      content: communityMessages.content,
      readAt: communityMessages.readAt,
      createdAt: communityMessages.createdAt,
      updatedAt: communityMessages.updatedAt
    };
  }
}
