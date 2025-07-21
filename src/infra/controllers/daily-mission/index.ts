import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateDailyMissionUseCase } from "@use-cases/daily-mission/create";
import { CreateDailyMissionDto } from "./dtos/create";
import { DailyMission } from "@domain/entities/daily-mission";
import { CreateDiaryMissionResposes } from "@infra/config/swagger/responses/diary-mission/create";
import { FindAllDailyMissionUseCase } from "@use-cases/daily-mission/find-all";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedEntity } from "@domain/entities/pagination";
import { FindAllDiaryMissionResposes } from "@infra/config/swagger/responses/diary-mission/find-all";
import { FindDailyMissionTrailUseCase } from "@use-cases/daily-mission/find-mission-trail";
import { FindDailyMissionTrail } from "@domain/repositories/daily-mission";
import { FindDailyMissionTrailResponses } from "@infra/config/swagger/responses/diary-mission/find-daily-mission-trail";

@Controller("daily-mission")
export class DailyMissionController {
  constructor(
    private readonly createDailyMissionUseCase: CreateDailyMissionUseCase,
    private readonly findAllDailyMissionUseCase: FindAllDailyMissionUseCase,
    private readonly findDailyMissionTrailUseCase: FindDailyMissionTrailUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CreateDiaryMissionResposes
  async create(
    @Body() body: CreateDailyMissionDto
  ): Promise<DailyMission | void> {
    return await this.createDailyMissionUseCase.execute(body);
  }

  @Get("/all/user/:userId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllDiaryMissionResposes
  async findAll(
    @Param("userId") userId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<DailyMission> | void> {
    const { page, pageSize } = query;

    return await this.findAllDailyMissionUseCase.execute({
      userId,
      page,
      pageSize
    });
  }

  @Get("/:dailyMissionId/user/:userId/trail")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindDailyMissionTrailResponses
  async findTrail(
    @Param("userId") userId: string,
    @Param("dailyMissionId") dailyMissionId: string
  ): Promise<FindDailyMissionTrail | void> {
    return await this.findDailyMissionTrailUseCase.execute({
      dailyMissionId,
      userId
    });
  }
}
