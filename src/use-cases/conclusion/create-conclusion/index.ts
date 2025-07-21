import { ConclusionAdapter } from "@domain/adapters/conclusion";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { DailyMissionRepository } from "@domain/repositories/daily-mission";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { EmployeeRepository } from "@domain/repositories/employee";
import { FinalTestRepository } from "@domain/repositories/finalTest";
import { MissionRepository } from "@domain/repositories/mission";
import { ModuleRepository } from "@domain/repositories/module";
import { StepRepository } from "@domain/repositories/step";
import { Injectable } from "@nestjs/common";

export interface CreateConclusionUseCaseParams {
  userId: string;
  disciplineId?: string;
  moduleId?: string;
  missionId?: string;
  stepId?: string;
  stepDailyMissionId?: string;
  dailyMissionId?: string;
  finalTest?: {
    activitiesHit: number;
    finalTestId: string;
  };
}

@Injectable()
export class CreateConclusionUseCase {
  constructor(
    private readonly conclusionAdapter: ConclusionAdapter,
    private readonly employeeRepository: EmployeeRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly missionRepository: MissionRepository,
    private readonly stepRepository: StepRepository,
    private readonly finalTestRepository: FinalTestRepository,
    private readonly dailyMissionRepository: DailyMissionRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: CreateConclusionUseCaseParams): Promise<void> {
    const {
      userId,
      disciplineId,
      finalTest,
      missionId,
      moduleId,
      stepId,
      dailyMissionId,
      stepDailyMissionId
    } = params;

    const user = await this.employeeRepository.findByUserIdWithUser(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a employee user with this id"
      });
    }

    const [discipline, module, mission, step, dailyMission, stepDailyMission] =
      await Promise.all([
        disciplineId
          ? this.disciplineRepository.findById(disciplineId)
          : Promise.resolve(null),
        moduleId
          ? this.moduleRepository.findById(moduleId)
          : Promise.resolve(null),
        missionId
          ? this.missionRepository.findById(missionId)
          : Promise.resolve(null),
        stepId ? this.stepRepository.findById(stepId) : Promise.resolve(null),
        dailyMissionId
          ? this.dailyMissionRepository.findById(dailyMissionId)
          : Promise.resolve(null),
        stepDailyMissionId
          ? this.stepRepository.findById(stepDailyMissionId)
          : Promise.resolve(null)
      ]);

    if (disciplineId && !discipline) {
      return this.exception.notFound({
        message: "Not found a discipline with this id"
      });
    }

    if (moduleId && !module) {
      return this.exception.notFound({
        message: "Not found a module with this id"
      });
    }

    if (missionId && !mission) {
      return this.exception.notFound({
        message: "Not found a mission with this id"
      });
    }

    if (stepId && !step) {
      return this.exception.notFound({
        message: "Not found a step with this id"
      });
    }

    if (dailyMissionId && !dailyMission) {
      return this.exception.notFound({
        message: "Not found a daily mission with this id"
      });
    }

    if (stepDailyMissionId && !stepDailyMission) {
      return this.exception.notFound({
        message: "Not found a step daily mission with this id"
      });
    }

    let finalTestEntity = null;

    if (finalTest) {
      const { finalTestId, activitiesHit } = finalTest;
      const MIN_ACTIVITIES_HIT_TO_PASS = 7;

      finalTestEntity = await this.finalTestRepository.findById(finalTestId);

      if (!finalTestEntity) {
        return this.exception.notFound({
          message: "Not found a final test with this id"
        });
      }

      if (activitiesHit < MIN_ACTIVITIES_HIT_TO_PASS) {
        return this.exception.badRequest({
          message:
            "You need to get at least 7 activities right to move on to the next mission."
        });
      }
    }

    await this.conclusionAdapter.createUserConclusion({
      startedAt: new Date(),
      userId,
      disciplineId,
      missionId,
      moduleId,
      stepId,
      stepDailyMissionId,
      dailyMissionId,
      finalTest: finalTest
        ? {
            activitiesHit: finalTest.activitiesHit,
            finalTestId: finalTest.finalTestId,
            employeeId: user.employee.id
          }
        : undefined
    });
  }
}
