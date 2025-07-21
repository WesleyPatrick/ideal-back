import { Controller, Get, Param, Query, StreamableFile } from "@nestjs/common";
import { ActiveUsersReportUseCase } from "@use-cases/report/active-users";
import { DefaultReportDTO } from "./dtos/active-users";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { ActiveUsersReportResponses } from "@infra/config/swagger/responses/reports/active-users";
import { MissionsConclusionReportUseCase } from "@use-cases/report/missions-conclusion";
import { ReportDTO } from "./dtos/mission-conclusion";
import { MissionsConclusionReportResponses } from "@infra/config/swagger/responses/reports/missions-conclusion";
import { SolecasReportUseCase } from "@use-cases/report/solecas";
import { SolecasReportResponses } from "@infra/config/swagger/responses/reports/solecas";

@Controller("reports")
export class ReportController {
  constructor(
    private readonly activeUsersReportUseCase: ActiveUsersReportUseCase,
    private readonly missionsConclusionReportUseCase: MissionsConclusionReportUseCase,
    private readonly solecasReportUseCase: SolecasReportUseCase
  ) {}

  @Get("active-users/operator/:operatorId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @ActiveUsersReportResponses
  async activeUsers(
    @Param("operatorId") operatorId: string,
    @Query() query: DefaultReportDTO
  ): Promise<StreamableFile | void> {
    const { employeeId, serviceProviderId } = query;

    return await this.activeUsersReportUseCase.execute({
      operatorId,
      employeeId,
      serviceProviderId
    });
  }

  @Get("missions-conclusion")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @MissionsConclusionReportResponses
  async missionsConclusion(
    @Query() query: ReportDTO
  ): Promise<StreamableFile | void> {
    const { operatorId, employeeId, serviceProviderId } = query;

    return await this.missionsConclusionReportUseCase.execute({
      operatorId,
      employeeId,
      serviceProviderId
    });
  }

  @Get("solecas")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @SolecasReportResponses
  async solecas(@Query() query: ReportDTO): Promise<StreamableFile | void> {
    const { employeeId, operatorId, serviceProviderId } = query;
    return await this.solecasReportUseCase.execute({
      operatorId,
      employeeId,
      serviceProviderId
    });
  }
}
