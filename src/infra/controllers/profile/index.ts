import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateProfileUseCase } from "@use-cases/profile/create";
import { CreateEmployeeProfileDto } from "./dtos/create";
import { CreateProfileResponses } from "@infra/config/swagger/responses/profile/create";
import { FindProfileByOperatorIdNoPaginationUseCase } from "@use-cases/profile/find-by-operatorId-no-pagination";
import { ProfileResume } from "@domain/repositories/profile";
import { FindProfileByOperatorIdResponses } from "@infra/config/swagger/responses/profile/find-by-operatorId-no-pagination";
import { FindProfilesByMissionIdNoPaginationUseCase } from "@use-cases/profile/find-by-missionId-no-pagination";
import { FindProfileByMissionIdResponses } from "@infra/config/swagger/responses/profile/find-by-missionId-no-pagination";

@Controller("profile")
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly findProfileByOperatorIdNoPagination: FindProfileByOperatorIdNoPaginationUseCase,
    private readonly findProfilesByMissionIdNoPaginationUseCase: FindProfilesByMissionIdNoPaginationUseCase
  ) {}

  @Post()
  @HttpCode(204)
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @CreateProfileResponses
  async create(@Body() body: CreateEmployeeProfileDto): Promise<void> {
    return await this.createProfileUseCase.execute(body);
  }

  @Get("/operator/:operatorId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FindProfileByOperatorIdResponses
  async findByOperatorId(
    @Param("operatorId") operatorId: string
  ): Promise<ProfileResume[] | void> {
    return await this.findProfileByOperatorIdNoPagination.execute(operatorId);
  }

  @Get("/mission/:missionId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FindProfileByMissionIdResponses
  async findByMissionIdNoPagination(
    @Param("missionId") missionId: string
  ): Promise<ProfileResume[] | void> {
    return await this.findProfilesByMissionIdNoPaginationUseCase.execute(
      missionId
    );
  }
}
