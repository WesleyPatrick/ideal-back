import { Profile } from "@domain/entities/profile";
import { Injectable } from "@nestjs/common";

export type ProfileAccessInput = {
  disciplineId: string;
  moduleId: string;
  missionId: string;
  stepId: string;
};

export interface CreateProfileParams {
  name: string;
  operatorId: string;
  accesses: ProfileAccessInput[];
}

export interface ProfileResume {
  id: string;
  name: string;
}

@Injectable()
export abstract class ProfileRepository {
  abstract create(params: CreateProfileParams): Promise<boolean>;
  abstract findById(profileId: string): Promise<Profile | null>;
  abstract findByOperatorIdNoPagination(
    operatorId: string
  ): Promise<ProfileResume[]>;
  abstract findByMissionIdNoPagination(
    missionId: string
  ): Promise<ProfileResume[]>;
}
