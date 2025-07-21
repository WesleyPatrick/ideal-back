import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FindByIdWithRelationsResponse,
  ModuleRepository
} from "@domain/repositories/module";
import { StatisticsRepository } from "@domain/repositories/statistics";
import { Injectable } from "@nestjs/common";

export interface FindModuleByIdWithRelationsResponse
  extends FindByIdWithRelationsResponse {
  studentsCount: number;
  conclusion: number;
}

@Injectable()
export class FindModuleByIdWithRelationsUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly statisticsRepository: StatisticsRepository
  ) {}

  async execute(
    moduleId: string
  ): Promise<FindModuleByIdWithRelationsResponse | void> {
    const module = await this.moduleRepository.findByIdWithRelations(moduleId);

    if (!module) {
      return this.exceptionAdapter.notFound({
        message: "Module not found"
      });
    }

    const { studentsCount, conclusion } =
      await this.statisticsRepository.getStudentsCountAndConclusionForModuleOrMission(
        { moduleId }
      );

    return {
      id: module.id,
      moduleName: module.moduleName,
      disciplineName: module.disciplineName,
      missionCount: Number(module.missionCount),
      stepCount: Number(module.stepCount),
      activitiesCount: Number(module.activitiesCount),
      studentsCount: Number(studentsCount),
      conclusion: Number(conclusion)
    };
  }
}
