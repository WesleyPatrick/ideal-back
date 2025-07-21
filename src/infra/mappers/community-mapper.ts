import { Community } from "@domain/entities/community";
import { Community as PrismaCommunity } from "@prisma/client";

export class CommunityMapper {
  static toDomain(community: PrismaCommunity): Community {
    return {
      id: community.id,
      name: community.name,
      author: community.author,
      resume: community.resume,
      cover: community.cover,
      operatorId: community.operatorId,
      profileId: community.profileId,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt
    };
  }

  static toPersistence(community: Community): PrismaCommunity {
    return {
      id: community.id,
      name: community.name,
      author: community.author,
      resume: community.resume,
      cover: community.cover,
      operatorId: community.operatorId,
      profileId: community.profileId,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt
    };
  }
}
