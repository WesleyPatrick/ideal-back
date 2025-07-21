import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  DisciplineRepository,
  DisciplineWithRelations
} from "@domain/repositories/discipline";
import { MissionRepository } from "@domain/repositories/mission";
import {
  EditModuleParams,
  ModuleRepository
} from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EditModuleUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: EditModuleParams
  ): Promise<DisciplineWithRelations | void> {
    const { missions, newModuleTitle, moduleId } = params;

    if (!newModuleTitle && !missions) {
      return this.exceptionAdapter.badRequest({
        message: "newMissionTitle or missions are required"
      });
    }

    const module = await this.moduleRepository.findById(moduleId);

    if (!module) {
      return this.exceptionAdapter.notFound({
        message: "Not found a module with this id"
      });
    }

    if (newModuleTitle) {
      const haveModuleWithThisTitle = await this.moduleRepository.findByName({
        disciplineId: module.disciplineId,
        moduleTitle: newModuleTitle
      });

      if (haveModuleWithThisTitle) {
        return this.exceptionAdapter.badRequest({
          message: "This module title already used in this discipline"
        });
      }
    }

    if (missions) {
      for (let i = 0; i < missions.length; i++) {
        const haveMissionWithThisTitle =
          await this.missionRepository.findByTitle({
            moduleId,
            missionTitle: missions[i].newMissionTitle
          });

        if (haveMissionWithThisTitle) {
          return this.exceptionAdapter.badRequest({
            message: `Mission title: ${missions[i].newMissionTitle} already used in this module`
          });
        }

        const mission = await this.missionRepository.findById(
          missions[i].missionId
        );

        if (mission.moduleId !== moduleId) {
          return this.exceptionAdapter.badRequest({
            message: `Mission ${mission.id} not pertence this module`
          });
        }
      }
    }

    const moduleUpdated = await this.moduleRepository.edit({
      moduleId,
      missions,
      newModuleTitle: newModuleTitle ?? module.title
    });

    if (!moduleUpdated) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to edit module"
      });
    }

    return await this.disciplineRepository.findByIdWithRelations(
      moduleUpdated.disciplineId
    );
  }
}
