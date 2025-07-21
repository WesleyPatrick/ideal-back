import { RoleValue } from "@domain/entities/roles";
import { CreateModuleResponse } from "@domain/repositories/module";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { DeleteModuleResponses } from "@infra/config/swagger/responses/module/delete";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { CreateModuleUseCase } from "@use-cases/module/create";
import { DeleteModuleUseCase } from "@use-cases/module/delete";
import { CreateModuleDTO } from "./dtos/create";
import { CreateModuleResponses } from "@infra/config/swagger/responses/module/create";
import { EditModuleBodyDTO } from "./dtos/edit";
import { DisciplineWithRelations } from "@domain/repositories/discipline";
import { EditModuleUseCase } from "@use-cases/module/edit";
import { DisciplineWithRelationsResponses } from "@infra/config/swagger/responses/discipline/find-by-id-with-relations";
import { Module } from "@domain/entities/module";
import { FindAllModulesByDisciplineId } from "@use-cases/module/find-all-by-disciplineId-no-pagination";
import { ModuleListResponses } from "@infra/config/swagger/responses/module/find-all-by-discipline-id";
import { FindModuleByDisciplineIdUseCase } from "@use-cases/module/find-by-disciplineId";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedEntity } from "@domain/entities/pagination";
import { PaginatedModulesResponses } from "@infra/config/swagger/responses/module/find-by-discipline-id-pagination";
import {
  FindModuleByIdWithRelationsResponse,
  FindModuleByIdWithRelationsUseCase
} from "@use-cases/module/find-with-relations";
import { FindModuleByIdWithRelationsResponses } from "@infra/config/swagger/responses/module/find-with-relations";

@Controller("module")
export class ModuleController {
  constructor(
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly editModuleUseCase: EditModuleUseCase,
    private readonly findAllByDisciplineIdNoPaginationUseCase: FindAllModulesByDisciplineId,
    private readonly findModuleByDisciplineIdUseCase: FindModuleByDisciplineIdUseCase,
    private readonly findModuleByIdWithRelationsUseCase: FindModuleByIdWithRelationsUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CreateModuleResponses
  async create(
    @Body() body: CreateModuleDTO
  ): Promise<CreateModuleResponse | void> {
    return await this.createModuleUseCase.execute({ ...body });
  }

  @HttpCode(204)
  @DeleteModuleResponses
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @Delete(":moduleId")
  async remove(@Param("moduleId") moduleId: string): Promise<void> {
    return await this.deleteModuleUseCase.execute(moduleId);
  }

  @Patch(":moduleId")
  @DisciplineWithRelationsResponses
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  async edit(
    @Param("moduleId") moduleId: string,
    @Body() body: EditModuleBodyDTO
  ): Promise<DisciplineWithRelations | void> {
    const { missions, newModuleTitle } = body;
    return await this.editModuleUseCase.execute({
      moduleId,
      missions,
      newModuleTitle
    });
  }

  @Get("/all/:disciplineId/no-pagination")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @ModuleListResponses
  async findAllByDisciplineIdNoPagination(
    @Param("disciplineId") disciplineId: string
  ): Promise<Module[] | void> {
    return await this.findAllByDisciplineIdNoPaginationUseCase.execute(
      disciplineId
    );
  }

  @Get("/all/discipline/:disciplineId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @PaginatedModulesResponses
  async findAllByDisciplineId(
    @Param("disciplineId") disciplineId: string,
    @Query() params: PaginatedDTO
  ): Promise<PaginatedEntity<Module> | void> {
    const { page, pageSize } = params;

    return await this.findModuleByDisciplineIdUseCase.execute({
      disciplineId,
      page,
      pageSize
    });
  }

  @Get(":moduleId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindModuleByIdWithRelationsResponses
  async findByIdWithRelations(
    @Param("moduleId") moduleId: string
  ): Promise<FindModuleByIdWithRelationsResponse | void> {
    return await this.findModuleByIdWithRelationsUseCase.execute(moduleId);
  }
}
