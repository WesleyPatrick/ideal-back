import { Community } from "@domain/entities/community";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  CommunityRepository,
  CreateCommunityParams,
  FindAllWithPagination,
  UpdateCommunityParams
} from "@domain/repositories/community";
import { PrismaService } from "@infra/config/prisma";
import { CommunityMapper } from "@infra/mappers/community-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCommunityRepository implements CommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCommunitiesByOperatorId(
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community>> {
    const { page = 1, pageSize = 10 } = params;

    const { communities, total } = await this.prisma.$transaction(
      async (tx) => {
        const communities = await tx.community.findMany({
          where: {
            operatorId
          },
          take: pageSize,
          skip: (page - 1) * pageSize
        });

        const total = await tx.community.count({
          where: {
            operatorId
          }
        });

        return {
          communities,
          total
        };
      }
    );

    return {
      data: communities.map(CommunityMapper.toDomain),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async findAllCommunitiesByServiceProviderId(
    serviceProviderId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community>> {
    const { page = 1, pageSize = 10 } = params;

    const { communities, total } = await this.prisma.$transaction(
      async (tx) => {
        const communities = await tx.community.findMany({
          where: {
            operator: {
              serviceProviders: {
                some: {
                  id: serviceProviderId
                }
              }
            }
          },
          take: pageSize,
          skip: (page - 1) * pageSize
        });

        const total = await tx.community.count({
          where: {
            operator: {
              serviceProviders: {
                some: {
                  id: serviceProviderId
                }
              }
            }
          }
        });

        return {
          communities,
          total
        };
      }
    );

    return {
      data: communities.map(CommunityMapper.toDomain),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async findByOperatorId(operatorId: string): Promise<Community | null> {
    const community = await this.prisma.community.findFirst({
      where: {
        operatorId
      }
    });

    if (!community) {
      return null;
    }

    return CommunityMapper.toDomain(community);
  }

  async create(params: CreateCommunityParams): Promise<Community> {
    const { author, cover, name, operatorId, resume, profileId } = params;

    const community = await this.prisma.community.create({
      data: {
        name,
        author,
        cover,
        resume,
        operatorId,
        profileId
      }
    });

    return CommunityMapper.toDomain(community);
  }

  async findById(communityId: string): Promise<Community | null> {
    const community = await this.prisma.community.findUnique({
      where: {
        id: communityId
      }
    });

    if (!community) {
      return null;
    }

    return CommunityMapper.toDomain(community);
  }

  async findAll(
    params: FindAllWithPagination
  ): Promise<PaginatedEntity<Community>> {
    const { page = 1, pageSize = 10, name } = params;

    const { communities, total } = await this.prisma.$transaction(
      async (tx) => {
        const communities = await tx.community.findMany({
          where: {
            name: {
              contains: name
            }
          },
          skip: (page - 1) * pageSize,
          take: pageSize
        });

        const total = await tx.community.count();

        return {
          communities,
          total
        };
      }
    );

    return {
      data: communities.map(CommunityMapper.toDomain),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async update(
    communityId: string,
    params: UpdateCommunityParams
  ): Promise<Community> {
    const { author, cover, name, resume } = params;

    const updatedCommunity = await this.prisma.community.update({
      where: {
        id: communityId
      },
      data: {
        name: name ?? undefined,
        author: author ?? undefined,
        cover: cover ?? undefined,
        resume: resume ?? undefined
      }
    });

    return CommunityMapper.toDomain(updatedCommunity);
  }

  async delete(communityId: string): Promise<boolean> {
    const deletedCommunity = await this.prisma.community.delete({
      where: {
        id: communityId
      }
    });

    return !!deletedCommunity;
  }
}
