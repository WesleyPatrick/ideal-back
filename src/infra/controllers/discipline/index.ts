import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles
} from "@nestjs/common";
import { CreateDisciplineUseCase } from "@use-cases/discipline/create";
import { CreateDisciplineDTO } from "./dtos/create-discipline";
import {
  CreateDisciplineResponse,
  DisciplineWithOperatorId,
  DisciplineWithRelations,
  FindAllByOperatorIdNoPaginationResponse
} from "@domain/repositories/discipline";
import { CreateDisciplineResponses } from "@infra/config/swagger/responses/discipline/create";
import { FindAllDisciplinesUseCase } from "@use-cases/discipline/findAll";
import { PaginatedEntity } from "@domain/entities/pagination";
import { Discipline } from "@domain/entities/discipline";
import { EditDisciplineDTO } from "./dtos/edit-discipline";
import { EditDisciplineUseCase } from "@use-cases/discipline/edit";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { EditDisciplineResponses } from "@infra/config/swagger/responses/discipline/edit";
import { DeleteDisciplineUseCase } from "@use-cases/discipline/delete";
import { DeleteDisciplineResponses } from "@infra/config/swagger/responses/discipline/delete";
import { FindDisciplineByIdWithRelations } from "@use-cases/discipline/find-by-id-with-relations";
import { DisciplineWithRelationsResponses } from "@infra/config/swagger/responses/discipline/find-by-id-with-relations";
import { FindAllDisciplinesDTO } from "./dtos/find-all";
import { FindAllDisciplineNoPagination } from "@use-cases/discipline/find-all-no-pagination";
import { DisciplineListResponses } from "@infra/config/swagger/responses/discipline/find-all-no-pagination";
import { FindDisciplineByOperatorIdUseCase } from "@use-cases/discipline/find-by-operatorId";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedDisciplineResponses } from "@infra/config/swagger/responses/discipline/find-by-operator-id";
import { FindDisciplineByIdWithOperatorIdResponses } from "@infra/config/swagger/responses/discipline/find-by-id-with-operatorId";
import { FindDisciplineByIdUseCase } from "@use-cases/discipline/findById";
import { FindDisciplinesByOperatorIdNoPaginationUseCase } from "@use-cases/discipline/find-by-operatorId-no-pagination";
import { FindDisciplinesByOperatorIdNoPaginationResponse } from "@infra/config/swagger/responses/discipline/find-all-by-operatorId-no-pagination";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { CreateDisciplineMultiPartBody } from "@infra/config/swagger/body/discipline/create";
import { UpdateDisciplineMultiPartBody } from "@infra/config/swagger/body/discipline/update";

@Controller("discipline")
export class DisciplineController {
  constructor(
    private readonly createDisciplineUseCase: CreateDisciplineUseCase,
    private readonly findAllDisciplinesUseCase: FindAllDisciplinesUseCase,
    private readonly editDisciplineUseCase: EditDisciplineUseCase,
    private readonly deleteDisciplineUseCase: DeleteDisciplineUseCase,
    private readonly findDisciplineByIdWithRelations: FindDisciplineByIdWithRelations,
    private readonly findDisciplineByIdUseCase: FindDisciplineByIdUseCase,
    private readonly findAllDisciplineNoPagination: FindAllDisciplineNoPagination,
    private readonly findDisciplineByOperatorIdUseCase: FindDisciplineByOperatorIdUseCase,
    private readonly findDisciplinesByOperatorIdNoPaginationUseCase: FindDisciplinesByOperatorIdNoPaginationUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CreateDisciplineResponses
  @CreateDisciplineMultiPartBody
  @FileUploadDecorator([{ name: "coverImage", maxCount: 1 }])
  async create(
    @Body() body: CreateDisciplineDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE]
      })
    )
    file: { coverImage: Express.Multer.File[] }
  ): Promise<CreateDisciplineResponse | void> {
    const coverImage = file.coverImage[0] || null;

    return await this.createDisciplineUseCase.execute(body, coverImage);
  }

  @Get("/all")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  async findAll(
    @Query() query: FindAllDisciplinesDTO
  ): Promise<PaginatedEntity<Discipline> | void> {
    const { page, pageSize, title } = query;

    return await this.findAllDisciplinesUseCase.execute({
      page,
      pageSize,
      title
    });
  }
  @Get(":disciplineId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FindDisciplineByIdWithOperatorIdResponses
  async findById(
    @Param("disciplineId") disciplineId: string
  ): Promise<DisciplineWithOperatorId | void> {
    return await this.findDisciplineByIdUseCase.execute(disciplineId);
  }

  @Patch(":disciplineId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateDisciplineMultiPartBody
  @EditDisciplineResponses
  async edit(
    @Param("disciplineId") disciplineId: string,
    @Body() body: EditDisciplineDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<Discipline | void> {
    const newCoverImage = file?.file?.[0] || null;

    return await this.editDisciplineUseCase.execute(
      disciplineId,
      {
        ...body
      },
      newCoverImage
    );
  }

  @HttpCode(204)
  @DeleteDisciplineResponses
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @Delete(":disciplineId")
  async remove(@Param("disciplineId") disciplineId: string): Promise<void> {
    return await this.deleteDisciplineUseCase.execute(disciplineId);
  }

  @Get(":disciplineId/with-relations")
  @DisciplineWithRelationsResponses
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  async findByIdWithRelations(
    @Param("disciplineId") disciplineId: string
  ): Promise<DisciplineWithRelations | void> {
    return await this.findDisciplineByIdWithRelations.execute(disciplineId);
  }

  @Get("/all/no-pagination")
  @DisciplineListResponses
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  async findAllNoPagination(): Promise<Discipline[] | void> {
    return await this.findAllDisciplineNoPagination.execute();
  }

  @Get("/all/operator/:operatorId")
  @PaginatedDisciplineResponses
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  async findByOperatorId(
    @Param("operatorId") operatorId: string,
    @Query() params: PaginatedDTO
  ): Promise<PaginatedEntity<Discipline>> {
    const { page, pageSize } = params;

    return await this.findDisciplineByOperatorIdUseCase.execute({
      operatorId,
      page,
      pageSize
    });
  }

  @Get("/all/operator/:operatorId/no-pagination")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FindDisciplinesByOperatorIdNoPaginationResponse
  async findAllByOperatorIdNoPagination(
    @Param("operatorId") operatorId: string
  ): Promise<FindAllByOperatorIdNoPaginationResponse[] | void> {
    return await this.findDisciplinesByOperatorIdNoPaginationUseCase.execute(
      operatorId
    );
  }
}
