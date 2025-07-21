import { CommunityMessage } from "@domain/entities/community-message";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  CommunityMessageRepository,
  CommunityMessageResponse,
  CreateCommunityMessageParams,
  FindAllMessagesParams,
  FindLastMessageParams,
  FindLastMessageResponse
} from "@domain/repositories/community-message";
import { PrismaService } from "@infra/config/prisma";
import { CommunityMessagesMapper } from "@infra/mappers/community-messages-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCommunityMessageRepository
  implements CommunityMessageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAllMessages(
    params: FindAllMessagesParams
  ): Promise<PaginatedEntity<CommunityMessageResponse>> {
    const { communityId, page = 1, pageSize = 10 } = params;

    const [communityMessages, total] = await this.prisma.$transaction([
      this.prisma.communityMessage.findMany({
        where: { communityId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          communityId: true,
          content: true,
          fromUserId: true,
          createdAt: true,
          readAt: true,
          updatedAt: true,
          fromUser: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        take: pageSize,
        skip: (page - 1) * pageSize
      }),
      this.prisma.communityMessage.count({
        where: { communityId }
      })
    ]);

    return {
      data: communityMessages.map((communityMessage) => ({
        id: communityMessage.id,
        communityId: communityMessage.communityId,
        content: communityMessage.content,
        fromUserId: communityMessage.fromUserId,
        fromUserAvatar: communityMessage.fromUser.avatar,
        fromUserName: communityMessage.fromUser.name,
        readAt: communityMessage.readAt,
        createdAt: communityMessage.createdAt,
        updatedAt: communityMessage.updatedAt
      })),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async findLastMessage(
    params: FindLastMessageParams
  ): Promise<PaginatedEntity<FindLastMessageResponse>> {
    const { employeeId, page = 1, pageSize = 10 } = params;

    const employeeCommunities = await this.prisma.employeeCommunity.findMany({
      where: { employeeId },
      select: { communityId: true }
    });

    const communityIds = employeeCommunities.map((ec) => ec.communityId);
    const total = communityIds.length;
    const lastPage = Math.ceil(total / pageSize);

    if (communityIds.length === 0) {
      return {
        data: [],
        page,
        total: 0,
        lastPage: 0
      };
    }

    const paginatedCommunityIds = communityIds.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const data: FindLastMessageResponse[] = [];

    for (const communityId of paginatedCommunityIds) {
      const lastMessage = await this.prisma.communityMessage.findFirst({
        where: { communityId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          community: {
            select: { id: true, name: true, cover: true }
          },
          fromUser: {
            select: { name: true }
          }
        }
      });

      if (lastMessage) {
        data.push({
          communityMessageId: lastMessage.id,
          communityId: lastMessage.community.id,
          communityName: lastMessage.community.name,
          communityCover: lastMessage.community.cover,
          lastMessageContent: lastMessage.content,
          lastMessageAuthorName: lastMessage.fromUser.name,
          lastMessageDatetime: lastMessage.createdAt
        });
      }
    }

    return {
      data,
      page,
      total,
      lastPage
    };
  }

  async create(
    params: CreateCommunityMessageParams
  ): Promise<CommunityMessage> {
    const { communityId, content, fromUserId } = params;

    const communityMessage = await this.prisma.communityMessage.create({
      data: {
        content,
        communityId,
        fromUserId
      }
    });

    return CommunityMessagesMapper.toDomain(communityMessage);
  }
}
