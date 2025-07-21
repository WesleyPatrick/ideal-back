import { Message } from "@domain/entities/message";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { RoleValue } from "@domain/entities/roles";
import { Injectable } from "@nestjs/common";

export interface SendMessageParams {
  fromUserId: string;
  toUserId: string;
  content: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  readAt?: Date;
  toUserId: string;
  fromUserId: string;
  createdAt: Date;
  fromUserAvatar: string;
  fromUserName: string;
  fromUserRole: RoleValue;
  toUserAvatar: string;
  toUserName: string;
  toUserRole: RoleValue;
}

export interface UnreadMessagesResponse {
  totalMessagesUnread: number;
  lastMessages: MessageResponse[];
}

export interface GetConversationParams extends PaginatedParams {
  toUserId: string;
  fromUserId: string;
}

export interface GetAllConversationsParams extends PaginatedParams {
  name?: string;
  userId: string;
}

@Injectable()
export abstract class ChatRepository {
  abstract sendMessage(params: SendMessageParams): Promise<MessageResponse>;

  abstract unread(myId: string): Promise<UnreadMessagesResponse>;

  abstract getConversation(
    params: GetConversationParams
  ): Promise<PaginatedEntity<MessageResponse>>;

  abstract getAllConversations(
    params: GetAllConversationsParams
  ): Promise<PaginatedEntity<MessageResponse>>;

  abstract readMessages(messagesIds: string[]): Promise<boolean>;

  abstract findById(messageId: string): Promise<Message | null>;
}
