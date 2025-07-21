import { CommunityMessage } from "@domain/entities/community-message";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Injectable } from "@nestjs/common";

export interface CreateCommunityMessageParams {
  fromUserId: string;
  communityId: string;
  content: string;
}

export interface FindLastMessageResponse {
  communityMessageId: string;
  communityId: string;
  communityName: string;
  communityCover: string;
  lastMessageContent: string;
  lastMessageAuthorName: string;
  lastMessageDatetime: Date;
}

export interface FindAllMessagesParams extends PaginatedParams {
  communityId: string;
}

export interface CommunityMessageResponse extends CommunityMessage {
  fromUserName: string;
  fromUserAvatar: string | null;
}

export interface FindLastMessageParams extends PaginatedParams {
  employeeId: string;
}

@Injectable()
export abstract class CommunityMessageRepository {
  abstract create(
    params: CreateCommunityMessageParams
  ): Promise<CommunityMessage>;
  abstract findLastMessage(
    params: FindLastMessageParams
  ): Promise<PaginatedEntity<FindLastMessageResponse>>;
  abstract findAllMessages(
    params: FindAllMessagesParams
  ): Promise<PaginatedEntity<CommunityMessageResponse>>;
}
