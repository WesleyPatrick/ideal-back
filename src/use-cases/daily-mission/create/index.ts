import { DateAdapter } from "@domain/adapters/date";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { DailyMission } from "@domain/entities/daily-mission";
import { DailyMissionRepository } from "@domain/repositories/daily-mission";
import { MissionRepository } from "@domain/repositories/mission";
import { ProfileRepository } from "@domain/repositories/profile";
import { Injectable } from "@nestjs/common";

export interface CreateDailyMissionUseCaseParams {
  daysUp: number;
  solecasAmount: number;
  missionId: string;
  profileId: string;
}

@Injectable()
export class CreateDailyMissionUseCase {
  constructor(
    private readonly dailyMissionRepository: DailyMissionRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly dateAdapter: DateAdapter,
    private readonly missionRepository: MissionRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: CreateDailyMissionUseCaseParams
  ): Promise<DailyMission | void> {
    const { daysUp, missionId, profileId, solecasAmount } = params;

    const mission = await this.missionRepository.findById(missionId);

    if (!mission) {
      return this.exception.notFound({
        message: "Not found mission with this id"
      });
    }

    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      return this.exception.notFound({
        message: "Not found a profile with this ids"
      });
    }

    if (solecasAmount <= 0) {
      return this.exception.badRequest({
        message: "Solecas amount must be greater than 0"
      });
    }

    if (daysUp <= 0) {
      return this.exception.badRequest({
        message: "Days up must be greater than 0"
      });
    }

    const startAt = new Date();

    const endAt = this.dateAdapter.addDays(startAt, daysUp);

    const dailyMission = await this.dailyMissionRepository.create({
      endAt,
      missionId,
      profileId,
      solecasAmount,
      startAt
    });

    if (!dailyMission) {
      return this.exception.internalServerError({
        message: "Error to create a daily mission"
      });
    }

    return dailyMission;
  }
}
