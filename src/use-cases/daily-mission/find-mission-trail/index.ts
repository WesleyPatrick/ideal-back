import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { RoleValue } from "@domain/entities/roles";
import {
  DailyMissionRepository,
  FindDailyMissionTrail
} from "@domain/repositories/daily-mission";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface FindDailyMissionTrailUseCaseParams {
  userId: string;
  dailyMissionId: string;
}

@Injectable()
export class FindDailyMissionTrailUseCase {
  constructor(
    private readonly dailyMissionRepository: DailyMissionRepository,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute({
    dailyMissionId,
    userId
  }: FindDailyMissionTrailUseCaseParams): Promise<FindDailyMissionTrail | void> {
    const dailyMission =
      await this.dailyMissionRepository.findById(dailyMissionId);

    if (!dailyMission) {
      return this.exception.notFound({
        message: "Not found a daily mission with this id"
      });
    }

    const user = await this.userRepository.findById(userId);

    if (!user || user.role !== RoleValue.EMPLOYEE) {
      return this.exception.notFound({
        message: "Not found a employee user with this id"
      });
    }

    return await this.dailyMissionRepository.findDailyMissionTrail(
      dailyMissionId,
      userId
    );
  }
}
