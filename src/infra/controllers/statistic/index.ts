import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { StatisticsResponses } from "@infra/config/swagger/responses/statistics/default";
import { Controller, Get, Param } from "@nestjs/common";
import { FindStatisticsByModuleIdUseCase } from "@use-cases/statistics/find-by-moduleId";
import { FindStatisticsByModuleIdAndMissionUseCase } from "@use-cases/statistics/find-by-moduleId-and-missionId";
import { FindStatisticsByModuleIdAndServiceProviderIdUseCase } from "@use-cases/statistics/find-by-moduleId-and-serviceProviderId";
import { FindStatisticsByModuleIdAndUserIdUseCase } from "@use-cases/statistics/find-by-moduleId-and-userId";
import { FindStatisticsByModuleIdAndMissionByServiceProviderIdUseCase } from "@use-cases/statistics/find-by-moduleId-missionId-and-serviceProviderId";
import { FindStatisticsByModuleIdAndMissionByUserIdUseCase } from "@use-cases/statistics/find-by-moduleId-missionId-and-userId";
import { StatisticResponse } from "@use-cases/statistics/utils";

@Controller("statistic")
export class StatisticController {
  constructor(
    private readonly findStatisticsByModuleIdUseCase: FindStatisticsByModuleIdUseCase,
    private readonly findStatisticsByModuleIdAndMissionIdUseCase: FindStatisticsByModuleIdAndMissionUseCase,
    private readonly findStatisticsByModuleIdAndServiceProviderIdUseCase: FindStatisticsByModuleIdAndServiceProviderIdUseCase,
    private readonly findStatisticsByModuleIdAndMissionByServiceProviderIdUseCase: FindStatisticsByModuleIdAndMissionByServiceProviderIdUseCase,
    private readonly findStatisticsByModuleIdAndUserIdUseCase: FindStatisticsByModuleIdAndUserIdUseCase,
    private readonly findStatisticsByModuleIdAndMissionByUserIdUseCase: FindStatisticsByModuleIdAndMissionByUserIdUseCase
  ) {}

  @Get("module/:moduleId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @StatisticsResponses
  async findByModuleId(
    @Param("moduleId") moduleId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdUseCase.execute(moduleId);
  }

  @Get("module/:moduleId/mission/:missionId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @StatisticsResponses
  async findByModuleIdAndMissionId(
    @Param("moduleId") moduleId: string,
    @Param("missionId") missionId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdAndMissionIdUseCase.execute(
      moduleId,
      missionId
    );
  }

  @Get("module/:moduleId/service-provider/:serviceProviderId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @StatisticsResponses
  async findByModuleIdAndServiceProviderId(
    @Param("moduleId") moduleId: string,
    @Param("serviceProviderId") serviceProviderId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdAndServiceProviderIdUseCase.execute(
      moduleId,
      serviceProviderId
    );
  }

  @Get(
    "module/:moduleId/mission/:missionId/service-provider/:serviceProviderId"
  )
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @StatisticsResponses
  async findByModuleIdAndMissionIdAndServiceProviderId(
    @Param("moduleId") moduleId: string,
    @Param("missionId") missionId: string,
    @Param("serviceProviderId") serviceProviderId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdAndMissionByServiceProviderIdUseCase.execute(
      { moduleId, missionId, serviceProviderId }
    );
  }

  @Get("module/:moduleId/user/:userId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @StatisticsResponses
  async findByModuleIdAndUserId(
    @Param("moduleId") moduleId: string,
    @Param("userId") userId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdAndUserIdUseCase.execute(
      moduleId,
      userId
    );
  }

  @Get("module/:moduleId/mission/:missionId/user/:userId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @StatisticsResponses
  async findByModuleIdAndMissionIdAndUserId(
    @Param("moduleId") moduleId: string,
    @Param("missionId") missionId: string,
    @Param("userId") userId: string
  ): Promise<StatisticResponse | void> {
    return await this.findStatisticsByModuleIdAndMissionByUserIdUseCase.execute(
      { moduleId, missionId, userId }
    );
  }
}
