import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { CreateServiceProviderUseCase } from "@use-cases/service-provider/create";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { CreateServiceProviderDTO } from "./dtos/create";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { CreateServiceProviderWithCsvDTO } from "./dtos/create-csv";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateServiceProviderWithCsvUseCase } from "@use-cases/service-provider/create-csv";
import { FindServiceProvidersDTO } from "./dtos/find-all";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  FindAllServiceProviderNoPaginationByOperatorIdResponse,
  FindAllServiceProviderReturn
} from "@domain/repositories/service-provider";
import { FindAllServiceProvidersUseCase } from "@use-cases/service-provider/find-all-paginated";
import { FindAllServiceProvidersResponses } from "@infra/config/swagger/responses/service-provider/find-all";
import { FindAllServicesProvidersNoPaginationByOperatorIdUseCase } from "@use-cases/service-provider/find-all-no-pagination-by-operatorId";
import { FindAllServicesProvidersByOperatorIdNoPaginationResponse } from "@infra/config/swagger/responses/service-provider/find-all-by-operatorId-no-pagination";
import { UpdateServiceProviderDto } from "./dtos/update";
import { UpdateServiceProviderUseCase } from "@use-cases/service-provider/update";
import { UpdateServiceProviderResponses } from "@infra/config/swagger/responses/service-provider/update";
import { CreateServiceProviderResponses } from "@infra/config/swagger/responses/service-provider/create";
import { FindServiceProviderByIdUseCase } from "@use-cases/service-provider/find-by-id";
import { UserWithServiceProvider } from "@domain/entities/base-user";
import { FindServiceProviderByIdResponses } from "@infra/config/swagger/responses/service-provider/find-by-id";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { CreateServiceProviderMultiPartBody } from "@infra/config/swagger/body/service-provider/create";
import { UpdateServiceProviderMultiPartBody } from "@infra/config/swagger/body/service-provider/update";

@ApiTags("Service Provider")
@Controller("service-provider")
export class ServiceProviderController {
  constructor(
    private readonly createServiceProviderUseCase: CreateServiceProviderUseCase,
    private readonly createServiceProviderWithCsvUseCase: CreateServiceProviderWithCsvUseCase,
    private readonly findAllServiceProvidersUseCase: FindAllServiceProvidersUseCase,
    private readonly findAllServicesProvidersNoPaginationByOperatorIdUseCase: FindAllServicesProvidersNoPaginationByOperatorIdUseCase,
    private readonly updateServiceProviderUseCase: UpdateServiceProviderUseCase,
    private readonly findServiceProviderByIdUseCase: FindServiceProviderByIdUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.OPERATOR, RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @CreateServiceProviderMultiPartBody
  @CreateServiceProviderResponses
  async create(
    @Body() body: CreateServiceProviderDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: { file?: Express.Multer.File[] }
  ): Promise<{ id: string } | void> {
    const serviceProviderAvatar = file?.file?.[0] || null;

    return await this.createServiceProviderUseCase.create(
      body,
      serviceProviderAvatar
    );
  }

  @AuthWithRoleDecorator([RoleValue.OPERATOR, RoleValue.ADMIN])
  @Post("create-csv")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateServiceProviderWithCsvDTO })
  @UseInterceptors(FileInterceptor("file"))
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @Query("operatorId") operatorId: string
  ): Promise<void> {
    return await this.createServiceProviderWithCsvUseCase.execute(
      file.buffer,
      operatorId
    );
  }

  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @Get("all")
  @FindAllServiceProvidersResponses
  async findAllPaginated(
    @Query() query: FindServiceProvidersDTO
  ): Promise<PaginatedEntity<FindAllServiceProviderReturn> | void> {
    const { operatorId, page, pageSize, name } = query;
    return this.findAllServiceProvidersUseCase.execute({
      operatorId,
      name,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10
    });
  }

  @Get("all/operator/:operatorId/no-pagination")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindAllServicesProvidersByOperatorIdNoPaginationResponse
  async findAllNoPaginationByOperatorId(
    @Param("operatorId") operatorId: string
  ): Promise<FindAllServiceProviderNoPaginationByOperatorIdResponse[] | void> {
    return await this.findAllServicesProvidersNoPaginationByOperatorIdUseCase.execute(
      operatorId
    );
  }

  @HttpCode(204)
  @Patch(":serviceProviderId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateServiceProviderMultiPartBody
  @UpdateServiceProviderResponses
  async update(
    @Param("serviceProviderId") serviceProviderId: string,
    @Body() body: UpdateServiceProviderDto,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<void> {
    const newAvatar = file?.file?.[0] || null;

    return await this.updateServiceProviderUseCase.execute(
      serviceProviderId,
      body,
      newAvatar
    );
  }

  @Get(":serviceProviderId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.ADMIN,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindServiceProviderByIdResponses
  async findById(
    @Param("serviceProviderId") serviceProviderId: string
  ): Promise<UserWithServiceProvider | void> {
    return await this.findServiceProviderByIdUseCase.execute(serviceProviderId);
  }
}
