import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { DailyMission } from "@domain/entities/daily-mission";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  DailyMissionRepository,
  FindAllDailyMissionsParams
} from "@domain/repositories/daily-mission";
import { EmployeeRepository } from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

export type FindAllDailyMissionUseCaseParams = Omit<
  FindAllDailyMissionsParams,
  "profileId"
>;

@Injectable()
export class FindAllDailyMissionUseCase {
  constructor(
    private readonly dailyMissionRepository: DailyMissionRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: FindAllDailyMissionUseCaseParams
  ): Promise<PaginatedEntity<DailyMission> | void> {
    const { userId, page, pageSize } = params;

    const user = await this.employeeRepository.findByUserIdWithUser(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a employee user with this id"
      });
    }

    return await this.dailyMissionRepository.findAllDailyMissions({
      userId,
      profileId: user.employee.profileId,
      page,
      pageSize
    });
  }
}
