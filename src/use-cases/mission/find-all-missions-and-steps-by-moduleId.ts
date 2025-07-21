import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  FindAllMissionsAndStepsByModuleIdResponse,
  MissionRepository
} from "@domain/repositories/mission";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllMissionsAndStepsByModuleIdUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    moduleId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllMissionsAndStepsByModuleIdResponse> | void> {
    const { page = 1, pageSize = 10 } = params;
    const haveModuleWithThisID = await this.moduleRepository.findById(moduleId);

    if (!haveModuleWithThisID) {
      return this.exceptionAdapter.notFound({
        message: "Not found a module with this id"
      });
    }

    return await this.missionRepository.findAllMissionsAndStepsByModuleId(
      moduleId,
      {
        page,
        pageSize
      }
    );
  }
}
