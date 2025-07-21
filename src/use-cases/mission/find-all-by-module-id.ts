import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Mission } from "@domain/entities/mission";
import { MissionRepository } from "@domain/repositories/mission";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllMissionByModuleIdUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly missionRepository: MissionRepository
  ) {}

  async execute(moduleId: string): Promise<Mission[] | void> {
    const haveModuleWithThisId = await this.moduleRepository.findById(moduleId);

    if (!haveModuleWithThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a module with this id"
      });
    }

    return await this.missionRepository.findAllByModuleId(moduleId);
  }
}
