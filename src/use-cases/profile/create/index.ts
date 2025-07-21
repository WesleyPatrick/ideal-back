import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { MissionRepository } from "@domain/repositories/mission";
import { ModuleRepository } from "@domain/repositories/module";
import { ProfileRepository } from "@domain/repositories/profile";
import { StepRepository } from "@domain/repositories/step";
import { Injectable } from "@nestjs/common";

export interface CreateEmployeeProfile {
  name: string;
  operatorId: string;
  disciplines: DisciplineAccess[];
}

export interface DisciplineAccess {
  disciplineId: string;
  modules: ModuleAccess[];
}

export interface ModuleAccess {
  moduleId: string;
  missions: StepMission[];
}

export interface StepMission {
  missionId: string;
  steps: string[];
}

@Injectable()
export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly missionRepository: MissionRepository,
    private readonly stepRepository: StepRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(params: CreateEmployeeProfile): Promise<void> {
    const { name, disciplines, operatorId } = params;
    const accesses = [];

    for (const discipline of disciplines) {
      for (const module of discipline.modules) {
        for (const mission of module.missions) {
          for (const stepId of mission.steps) {
            await this.validateIdsOrFail({
              disciplineId: discipline.disciplineId,
              moduleId: module.moduleId,
              missionId: mission.missionId,
              stepId
            });

            accesses.push({
              disciplineId: discipline.disciplineId,
              moduleId: module.moduleId,
              missionId: mission.missionId,
              stepId
            });
          }
        }
      }
    }

    const profile = await this.profileRepository.create({
      name,
      accesses,
      operatorId
    });

    if (!profile) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to create a profile"
      });
    }
  }

  private async validateIdsOrFail({
    disciplineId,
    moduleId,
    missionId,
    stepId
  }: {
    disciplineId: string;
    moduleId: string;
    missionId: string;
    stepId: string;
  }): Promise<void> {
    const disciplineExists =
      await this.disciplineRepository.findById(disciplineId);
    if (!disciplineExists) {
      return this.exceptionAdapter.notFound({
        message: `Discipline not found with this id: ${disciplineId}`
      });
    }

    const moduleExists = await this.moduleRepository.findById(moduleId);
    if (!moduleExists) {
      return this.exceptionAdapter.notFound({
        message: `Module not found with this id: ${moduleId}`
      });
    }

    const missionExists = await this.missionRepository.findById(missionId);
    if (!missionExists) {
      return this.exceptionAdapter.notFound({
        message: `Mission not found with this id: ${missionId}`
      });
    }

    const stepExists = await this.stepRepository.findById(stepId);
    if (!stepExists) {
      return this.exceptionAdapter.notFound({
        message: `Step not found with this id: ${stepId}`
      });
    }
  }
}
