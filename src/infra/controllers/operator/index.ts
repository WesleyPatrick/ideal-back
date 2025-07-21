import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles
} from "@nestjs/common";
import { CreateOperatorUseCase } from "@use-cases/operator/create";
import { ApiTags } from "@nestjs/swagger";
import { CreateOperatorDTO } from "./dtos/create";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { FindOperatorByIdUseCase } from "@use-cases/operator/find-by-id";
import { FindAllOperatorsUseCase } from "@use-cases/operator/find-all";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  FindAllNoPaginationResponse,
  FindAllOperatorsReturn,
  FindOperatorByIdReturn
} from "@domain/repositories/operator";
import { FindAllOperatorsDTO } from "./dtos/find-all";
import { FindAllOperatorsResponses } from "@infra/config/swagger/responses/operator/find-all";
import { FindOperatorByIdResponses } from "@infra/config/swagger/responses/operator/find";
import { UpdateOperatorDTO } from "./dtos/update";
import { User } from "@domain/entities/base-user";
import { UpdateOperatorUseCase } from "@use-cases/operator/update";
import { UpdateOperatorResponse } from "@infra/config/swagger/responses/operator/update";
import { FindAllOperatorsNoPaginationUseCase } from "@use-cases/operator/find-all-no-pagination";
import { CreateOperatorResponses } from "@infra/config/swagger/responses/operator/create";
import { FindAllOperatorNoPaginationResponses } from "@infra/config/swagger/responses/operator/find-all-no-pagination";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { CreateOperatorMultiPartBody } from "@infra/config/swagger/body/operator/create";
import { UpdateOperatorMultiPartBody } from "@infra/config/swagger/body/operator/update";

@ApiTags("Operator")
@Controller("operator")
export class OperatorController {
  constructor(
    private readonly createOperatorUseCase: CreateOperatorUseCase,
    private readonly findOperatorByIdUseCase: FindOperatorByIdUseCase,
    private readonly findAllOperatorsUseCase: FindAllOperatorsUseCase,
    private readonly updateOperatorUseCase: UpdateOperatorUseCase,
    private readonly findAllOperatorsNoPaginationUseCase: FindAllOperatorsNoPaginationUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @CreateOperatorMultiPartBody
  @CreateOperatorResponses
  async create(
    @Body() body: CreateOperatorDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: { file?: Express.Multer.File[] }
  ): Promise<void> {
    const operatorAvatar = file?.file?.[0] || null;

    return await this.createOperatorUseCase.create(body, operatorAvatar);
  }

  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @Get("all")
  @FindAllOperatorsResponses
  async findAll(
    @Query() query: FindAllOperatorsDTO
  ): Promise<PaginatedEntity<FindAllOperatorsReturn>> {
    const { page = 1, pageSize = 10 } = query;
    return await this.findAllOperatorsUseCase.execute({
      page,
      pageSize
    });
  }

  @Get(":operatorId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FindOperatorByIdResponses
  async findById(
    @Param("operatorId") operatorId: string
  ): Promise<FindOperatorByIdReturn | void> {
    return await this.findOperatorByIdUseCase.execute(operatorId);
  }

  @Patch(":operatorId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateOperatorMultiPartBody
  @UpdateOperatorResponse
  async updateOperator(
    @Param("operatorId") operatorId: string,
    @Body() body: UpdateOperatorDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<User | void> {
    const newAvatar = file?.file?.[0] || null;

    return await this.updateOperatorUseCase.execute({
      operatorId,
      ...body,
      newAvatar
    });
  }

  @Get("/all/no-pagination")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FindAllOperatorNoPaginationResponses
  async findAllNoPagination(): Promise<FindAllNoPaginationResponse[]> {
    return await this.findAllOperatorsNoPaginationUseCase.execute();
  }
}
