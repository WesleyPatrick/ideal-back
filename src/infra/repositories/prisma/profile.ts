import { Profile } from "@domain/entities/profile";
import {
  CreateProfileParams,
  ProfileRepository,
  ProfileResume
} from "@domain/repositories/profile";
import { PrismaService } from "@infra/config/prisma";
import { ProfileMapper } from "@infra/mappers/profile-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByMissionIdNoPagination(
    missionId: string
  ): Promise<ProfileResume[]> {
    const profiles = await this.prisma.profile.findMany({
      where: {
        accesses: {
          some: {
            missionId
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    return profiles;
  }

  async findByOperatorIdNoPagination(
    operatorId: string
  ): Promise<ProfileResume[]> {
    const operators = await this.prisma.profile.findMany({
      select: {
        id: true,
        name: true
      },
      where: {
        operatorId
      }
    });

    return operators;
  }

  async findById(profileId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId
      }
    });

    if (!profile) {
      return null;
    }

    return ProfileMapper.toDomain(profile);
  }

  async create(params: CreateProfileParams): Promise<boolean> {
    const { accesses, name, operatorId } = params;

    const profile = await this.prisma.profile.create({
      data: {
        name,
        operatorId,
        accesses: {
          createMany: {
            data: accesses
          }
        }
      }
    });

    return !!profile;
  }
}
