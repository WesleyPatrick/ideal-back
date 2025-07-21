import { RoleValue } from "@domain/entities/roles";
import {
  FindAllActivitiesByStepIdResponse,
  FindAllStepsAndActivitiesByMissionIdResponse
} from "@domain/repositories/step";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { FindAllActivitiesByStepIdResponses } from "@infra/config/swagger/responses/step/find-all-activities-in-step";
import { FindAllStepsByMissionIdResponses } from "@infra/config/swagger/responses/step/find-all-by-missionId";
import { Controller, Get, Param } from "@nestjs/common";
import { FindAllActivitiesInStepUseCase } from "@use-cases/step/find-all-activies-in-step";
import { FindAllActivitiesInDailyMissionStepUseCase } from "@use-cases/step/find-all-activities-in-daily-mission-step";
import { FindAllStepsByMissionId } from "@use-cases/step/find-by-missionId";

@Controller("step")
export class StepController {
  constructor(
    private readonly findAllStepsByMissionId: FindAllStepsByMissionId,
    private readonly findAllActivitiesInStepUseCase: FindAllActivitiesInStepUseCase,
    private readonly findAllActivitiesInDailyMissionStepUseCase: FindAllActivitiesInDailyMissionStepUseCase
  ) {}

  @Get("/mission/:missionId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindAllStepsByMissionIdResponses
  async findByMissionId(
    @Param("missionId") missionId: string
  ): Promise<FindAllStepsAndActivitiesByMissionIdResponse[] | void> {
    return await this.findAllStepsByMissionId.execute(missionId);
  }

  @Get(":stepId/user/:userId/all-activities")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllActivitiesByStepIdResponses
  async findAllActivies(
    @Param("stepId") stepId: string,
    @Param("userId") userId: string
  ): Promise<FindAllActivitiesByStepIdResponse | void> {
    return await this.findAllActivitiesInStepUseCase.execute(stepId, userId);
  }

  @Get("daily-mission/:stepId/user/:userId/all-activities")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllActivitiesByStepIdResponses
  async findAllDailyMissionActivies(
    @Param("stepId") stepId: string,
    @Param("userId") userId: string
  ): Promise<FindAllActivitiesByStepIdResponse | void> {
    return await this.findAllActivitiesInDailyMissionStepUseCase.execute(
      stepId,
      userId
    );
  }
}
