import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FindByIdWithRelationsResponse,
  MissionRepository
} from "@domain/repositories/mission";
import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";

export interface FindMissionByIdWithRelationsUseCaseResponse
  extends FindByIdWithRelationsResponse {
  missionCount: number;
  stepCount: number;
  activitiesCount: number;
  studentsCount: number;
  conclusion: number;
}

@Injectable()
export class FindMissionByIdWithRelationsUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly statisticsRepository: StatisticsRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    missionId: string
  ): Promise<FindMissionByIdWithRelationsUseCaseResponse | void> {
    const mission =
      await this.missionRepository.findByIdWithRelations(missionId);

    if (!mission) {
      return this.exceptionAdapter.notFound({
        message: "Mission not found"
      });
    }

    const { studentsCount, conclusion } =
      await this.statisticsRepository.getStudentsCountAndConclusionForModuleOrMission(
        { moduleId: mission.moduleId, missionId }
      );

    return {
      id: mission.id,
      missionName: mission.missionName,
      moduleId: mission.moduleId,
      moduleName: mission.moduleName,
      disciplineName: mission.disciplineName,
      missionCount: 1,
      stepCount: 5,
      activitiesCount: 25,
      studentsCount: Number(studentsCount),
      conclusion: Number(conclusion)
    };
  }
}
