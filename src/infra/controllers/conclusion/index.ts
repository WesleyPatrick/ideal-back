import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, HttpCode, Patch, Post } from "@nestjs/common";
import { CreateConclusionUseCase } from "@use-cases/conclusion/create-conclusion";
import { FinishedConclusionUseCase } from "@use-cases/conclusion/finished-conclusion";
import { CreateConclusionDTO } from "./dtos/create-conclusion";
import { FinishedConclusionDTO } from "./dtos/finished-conclusion";
import { FinishedConclusionResponses } from "@infra/config/swagger/responses/conclusion/finished-conclusion";
import { CreateConclusionResponses } from "@infra/config/swagger/responses/conclusion/create-conclusion";

@Controller("conclusion")
export class ConclusionController {
  constructor(
    private readonly createConclusionUseCase: CreateConclusionUseCase,
    private readonly finishedConclusionUseCase: FinishedConclusionUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CreateConclusionResponses
  async createConclusion(@Body() body: CreateConclusionDTO): Promise<void> {
    return await this.createConclusionUseCase.execute(body);
  }

  @HttpCode(204)
  @Patch()
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FinishedConclusionResponses
  async finished(@Body() body: FinishedConclusionDTO): Promise<void> {
    return await this.finishedConclusionUseCase.execute(body);
  }
}
