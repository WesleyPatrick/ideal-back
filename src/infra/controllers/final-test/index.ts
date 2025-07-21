import { RoleValue } from "@domain/entities/roles";
import { FindAllActivitiesInFinalTestResponse } from "@domain/repositories/finalTest";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { EmployeeCanAccessFinalTestResponses } from "@infra/config/swagger/responses/final-test/employee-can-access-final-test";
import { FindAllActivitisInFinalTestResponses } from "@infra/config/swagger/responses/final-test/find-all-activities-in-final-test";
import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { EmployeeCanAccessFinalTestUseCase } from "@use-cases/final-test/employee-can-access-final-test";
import { FindAllActivitiesInFinalTestUseCase } from "@use-cases/final-test/find-all-activities-in-final-test";
import { EmployeeCanAccessFinalTestDTO } from "./dtos/employee-can-access-final-test";

@Controller("final-test")
export class FinalTestController {
  constructor(
    private readonly findAllActivitiesInFinalTestUseCase: FindAllActivitiesInFinalTestUseCase,
    private readonly employeeCanAccessFinalTestUseCase: EmployeeCanAccessFinalTestUseCase
  ) {}

  @Get(":finalTestId/all-activities")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllActivitisInFinalTestResponses
  async findAllActivities(
    @Param("finalTestId") finalTestId: string
  ): Promise<FindAllActivitiesInFinalTestResponse | void> {
    return await this.findAllActivitiesInFinalTestUseCase.execute(finalTestId);
  }

  @HttpCode(204)
  @Get("/user/:userId/mission/:missionId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @EmployeeCanAccessFinalTestResponses
  async employeeCanAccessFinalTest(
    @Param() params: EmployeeCanAccessFinalTestDTO
  ): Promise<void> {
    const { userId, missionId } = params;

    return await this.employeeCanAccessFinalTestUseCase.execute({
      missionId,
      userId
    });
  }
}
