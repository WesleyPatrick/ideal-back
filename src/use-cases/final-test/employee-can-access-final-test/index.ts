import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { RoleValue } from "@domain/entities/roles";
import { MissionRepository } from "@domain/repositories/mission";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface EmployeeCanAccessFinalTestUseCaseParams {
  userId: string;
  missionId: string;
}

@Injectable()
export class EmployeeCanAccessFinalTestUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly missionRepository: MissionRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: EmployeeCanAccessFinalTestUseCaseParams
  ): Promise<void> {
    const { missionId, userId } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    if (user.role !== RoleValue.EMPLOYEE) {
      return this.exception.badRequest({
        message: "This user is not a employee"
      });
    }

    const mission = await this.missionRepository.findById(missionId);

    if (!mission) {
      return this.exception.notFound({
        message: "Not found a mission with this id"
      });
    }

    const { activitiesCorrectDone, totalActivitiesMission } =
      await this.missionRepository.getEmployeeMissionProgress({
        missionId,
        userId
      });

    const progressPercentage =
      (activitiesCorrectDone / totalActivitiesMission) * 100;

    const MINIMUM_PROGRESS_PERCENTAGE = 70;

    if (progressPercentage < MINIMUM_PROGRESS_PERCENTAGE) {
      return this.exception.badRequest({
        message: `Employee has only completed ${progressPercentage.toFixed(1)}% of activities correctly, minimum required is 70%.`
      });
    }

    return;
  }
}
