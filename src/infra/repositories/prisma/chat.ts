import { Message } from "@domain/entities/message";
import { PaginatedEntity } from "@domain/entities/pagination";
import { RoleValue } from "@domain/entities/roles";
import {
  ChatRepository,
  GetAllConversationsParams,
  GetConversationParams,
  MessageResponse,
  SendMessageParams,
  UnreadMessagesResponse
} from "@domain/repositories/chat";
import { PrismaService } from "@infra/config/prisma";
import { MessageMapper } from "@infra/mappers/message-mapper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(params: SendMessageParams): Promise<MessageResponse> {
    const { content, fromUserId, toUserId } = params;

    const message = await this.prisma.message.create({
      data: {
        content,
        toUserId,
        fromUserId
      },
      include: {
        fromUser: {
          select: {
            avatar: true,
            name: true,
            role: true
          }
        },
        toUser: {
          select: {
            avatar: true,
            name: true,
            role: true
          }
        }
      }
    });

    return {
      fromUserAvatar: message.fromUser.avatar,
      fromUserName: message.fromUser.name,
      fromUserRole: message.fromUser.role as RoleValue,
      toUserAvatar: message.toUser.avatar,
      toUserName: message.toUser.name,
      toUserRole: message.toUser.role as RoleValue,
      content: message.content,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      createdAt: message.createdAt,
      id: message.id,
      readAt: message.readAt
    };
  }

  async unread(myId: string): Promise<UnreadMessagesResponse> {
    const { count, lastMessages } = await this.prisma.$transaction(
      async (tx) => {
        const count = await tx.message.count({
          where: {
            fromUserId: {
              not: myId
            },
            toUserId: myId,
            readAt: null
          }
        });

        const lastMessages: MessageResponse[] = await tx.$queryRaw<
          MessageResponse[]
        >`
      WITH ranked_records AS (
    SELECT
      m.id,
      m.content,
      m."from_user_id" AS "fromUserId",
      m."to_user_id" AS "toUserId",
      m."created_at" AS "createdAt",
      m."read_at" AS "readAt",

      u_from.avatar AS "fromUserAvatar",
      u_from.name AS "fromUserName",
      u_from.role AS "fromUserRole",

      u_to.avatar AS "toUserAvatar",
      u_to.name AS "toUserName",
      u_to.role AS "toUserRole",

      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN m."from_user_id" = ${myId} THEN m."to_user_id" 
            ELSE m."from_user_id" 
          END
        ORDER BY m."created_at" DESC
      ) AS rn
    FROM "messages" m
    LEFT JOIN "users" u_from ON u_from.id = m."from_user_id"
    LEFT JOIN "users" u_to ON u_to.id = m."to_user_id"
    WHERE m."from_user_id" = ${myId} OR m."to_user_id" = ${myId}
  )
  SELECT * FROM ranked_records
  WHERE rn = 1
  ORDER BY "createdAt" DESC
  LIMIT 3;
      `;

        return {
          count,
          lastMessages
        };
      }
    );

    return {
      totalMessagesUnread: count,
      lastMessages: lastMessages.map((message) => {
        return {
          fromUserAvatar: message.fromUserAvatar,
          fromUserName: message.fromUserName,
          fromUserRole: message.fromUserRole as RoleValue,
          toUserAvatar: message.toUserAvatar,
          toUserName: message.toUserName,
          toUserRole: message.toUserRole as RoleValue,
          content: message.content,
          fromUserId: message.fromUserId,
          toUserId: message.toUserId,
          createdAt: message.createdAt,
          readAt: message.readAt,
          id: message.id
        };
      })
    };
  }

  async getConversation(
    params: GetConversationParams
  ): Promise<PaginatedEntity<MessageResponse>> {
    const { fromUserId, toUserId, page = 1, pageSize = 10 } = params;

    const { conversation, total } = await this.prisma.$transaction(
      async (tx) => {
        const total = await tx.message.count({
          where: {
            OR: [
              {
                fromUserId: fromUserId,
                toUserId: toUserId
              },
              {
                fromUserId: toUserId,
                toUserId: fromUserId
              }
            ]
          }
        });

        const conversation = await tx.message.findMany({
          where: {
            OR: [
              {
                fromUserId: fromUserId,
                toUserId: toUserId
              },
              {
                fromUserId: toUserId,
                toUserId: fromUserId
              }
            ]
          },
          orderBy: {
            createdAt: "desc"
          },
          include: {
            fromUser: {
              select: {
                avatar: true,
                name: true,
                role: true
              }
            },
            toUser: {
              select: {
                avatar: true,
                name: true,
                role: true
              }
            }
          },
          skip: (page - 1) * pageSize,
          take: pageSize
        });

        return {
          total,
          conversation
        };
      }
    );

    return {
      data: conversation.map((message) => {
        return {
          fromUserAvatar: message.fromUser.avatar,
          fromUserName: message.fromUser.name,
          fromUserRole: message.fromUser.role as RoleValue,
          toUserAvatar: message.toUser.avatar,
          toUserName: message.toUser.name,
          toUserRole: message.toUser.role as RoleValue,
          content: message.content,
          fromUserId: message.fromUserId,
          toUserId: message.toUserId,
          createdAt: message.createdAt,
          id: message.id,
          readAt: message.readAt,
          updatedAt: message.updatedAt
        };
      }),
      lastPage: Math.ceil(total / pageSize),
      page,
      total
    };
  }

  async getAllConversations(
    params: GetAllConversationsParams
  ): Promise<PaginatedEntity<MessageResponse>> {
    const { page = 1, pageSize = 10, userId, name } = params;

    const { totalDistinct, conversations } = await this.prisma.$transaction(
      async (tx) => {
        const totalDistinct = await tx.message.count({
          where: {
            OR: [{ fromUserId: userId }, { toUserId: userId }]
          }
        });

        const conversations: MessageResponse[] = await tx.$queryRaw<
          MessageResponse[]
        >`
  WITH ranked_records AS (
    SELECT
      m.id,
      m.content,
      m."from_user_id" as "fromUserId",
      m."to_user_id" as "toUserId",
      m."created_at" as "createdAt",
      m."read_at" as "readAt",
      u_from.avatar as "fromUserAvatar",
      u_from.name as "fromUserName",
      u_from.role as "fromUserRole",
      u_to.avatar as "toUserAvatar",
      u_to.name as "toUserName",
      u_to.role as "toUserRole",
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN m."from_user_id" = ${userId} THEN m."to_user_id" 
            ELSE m."from_user_id" 
          END
        ORDER BY m."created_at" DESC
      ) AS rn
    FROM "messages" m
    LEFT JOIN "users" u_from ON u_from.id = m."from_user_id"
    LEFT JOIN "users" u_to ON u_to.id = m."to_user_id"
    WHERE (m."from_user_id" = ${userId} OR m."to_user_id" = ${userId})
    ${name ? Prisma.sql`AND (u_from.name ILIKE ${"%" + name + "%"} OR u_to.name ILIKE ${"%" + name + "%"})` : Prisma.empty}
  )
  SELECT * FROM ranked_records
  WHERE rn = 1
  ORDER BY "createdAt" DESC
  LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
`;

        return {
          totalDistinct,
          conversations
        };
      }
    );

    return {
      data: conversations.map((message) => {
        return {
          fromUserAvatar: message.fromUserAvatar,
          fromUserName: message.fromUserName,
          fromUserRole: message.fromUserRole as RoleValue,
          toUserAvatar: message.toUserAvatar,
          toUserName: message.toUserName,
          toUserRole: message.toUserRole as RoleValue,
          content: message.content,
          fromUserId: message.fromUserId,
          toUserId: message.toUserId,
          createdAt: message.createdAt,
          id: message.id,
          readAt: message.readAt
        };
      }),
      lastPage: Math.ceil(totalDistinct / pageSize),
      page,
      total: totalDistinct
    };
  }

  async readMessages(messagesIds: string[]): Promise<boolean> {
    const now = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const result = await tx.message.updateMany({
        where: {
          id: { in: messagesIds },
          readAt: null
        },
        data: {
          readAt: now
        }
      });

      return result.count > 0;
    });
  }

  async findById(messageId: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId
      }
    });

    if (!message) {
      return null;
    }

    return MessageMapper.toDomain(message);
  }
}
