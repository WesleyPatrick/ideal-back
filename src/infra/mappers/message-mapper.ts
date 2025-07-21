import { Message } from "@domain/entities/message";
import { Message as PrismaMessage } from "@prisma/client";

export class MessageMapper {
  static toDomain(message: PrismaMessage): Message {
    return {
      id: message.id,
      toUserId: message.toUserId,
      fromUserId: message.fromUserId,
      content: message.content,
      readAt: message.readAt,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }

  static toPersistence(message: Message): PrismaMessage {
    return {
      id: message.id,
      toUserId: message.toUserId,
      fromUserId: message.fromUserId,
      content: message.content,
      readAt: message.readAt,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }
}
