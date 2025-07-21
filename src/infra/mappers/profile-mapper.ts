import { Profile } from "@domain/entities/profile";
import { Profile as PrismaProfile } from "@prisma/client";

export class ProfileMapper {
  static toDomain(profile: PrismaProfile): Profile {
    return {
      id: profile.id,
      name: profile.name,
      operatorId: profile.operatorId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };
  }

  static toPersistence(profile: Profile): PrismaProfile {
    return {
      id: profile.id,
      name: profile.name,
      operatorId: profile.operatorId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };
  }
}
