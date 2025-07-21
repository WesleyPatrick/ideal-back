import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { MissionRepository } from "@domain/repositories/mission";
import { ProfileRepository, ProfileResume } from "@domain/repositories/profile";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindProfilesByMissionIdNoPaginationUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(missionId: string): Promise<ProfileResume[] | void> {
    const mission = await this.missionRepository.findById(missionId);

    if (!mission) {
      return this.exception.notFound({
        message: "Not found a mission with this id"
      });
    }

    return await this.profileRepository.findByMissionIdNoPagination(missionId);
  }
}
