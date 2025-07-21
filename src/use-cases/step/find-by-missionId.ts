import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { MissionRepository } from "@domain/repositories/mission";
import {
  FindAllStepsAndActivitiesByMissionIdResponse,
  StepRepository
} from "@domain/repositories/step";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllStepsByMissionId {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly stepRepository: StepRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    missionId: string
  ): Promise<FindAllStepsAndActivitiesByMissionIdResponse[] | void> {
    const mission = await this.missionRepository.findById(missionId);

    if (!mission) {
      return this.exceptionAdapter.notFound({
        message: "Not found a mission with this id"
      });
    }

    return await this.stepRepository.findAllStepsAndActivitiesByMissionId(
      missionId
    );
  }
}
