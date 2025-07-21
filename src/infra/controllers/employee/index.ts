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
import { CreateEmployeeUseCase } from "@use-cases/employee/create";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { CreateEmployeeDTO } from "./dtos/create";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateEmployeeWithCsvDTO } from "./dtos/create-csv";
import { CreateEmployeeWithCsvUseCase } from "@use-cases/employee/create-csv";
import {
  FindAllDisciplineByEmployeeIdResponse,
  FindAllEmployeeNoPaginationByServiceProviderIdResponse,
  FindAllEmployeesReturn,
  FindEmployeeProfileResponse,
  CardResponse,
  FindModuleTrailResponse,
  CardResponseWithoutLastAttempt
} from "@domain/repositories/employee";
import { PaginatedEntity } from "@domain/entities/pagination";
import { FindAllEmployeesPaginatedUseCase } from "@use-cases/employee/find-all-paginated";
import { FindAllEmployeesResponse } from "@infra/config/swagger/responses/employee/find-all";
import { FindAllEmployeesByServiceProviderIdNoPaginationUseCase } from "@use-cases/employee/find-all-by-serviceProviderId-no-pagination";
import { FindAllEmployeesByServiceProviderIdNoPaginationResponse } from "@infra/config/swagger/responses/employee/find-all-by-serviceProviderId-no-pagination";
import { UpdateEmployeeDto } from "./dtos/update";
import { UpdateEmployeeUseCase } from "@use-cases/employee/update";
import { CreateEmployeeResponses } from "@infra/config/swagger/responses/employee/create";
import { FindEmployeeByIdUseCase } from "@use-cases/employee/find-by-id";
import { User, UserWithEmployee } from "@domain/entities/base-user";
import { FindEmployeeByIdResponses } from "@infra/config/swagger/responses/employee/find-by-id";
import {
  AddEmployeeSolecasUseCase,
  AddEmployeeSolecasUseCaseResponse
} from "@use-cases/employee/add-solecas";
import { AddSolecasDTO } from "./dtos/add-solecas";
import { AddEmployeeSolecasResponses } from "@infra/config/swagger/responses/employee/add-solecas";
import { FindAllDisciplinesByEmployeeIdUseCase } from "@use-cases/employee/find-all-disciplines";
import { FindAllEmployeeDisciplinesResponses } from "@infra/config/swagger/responses/employee/find-all-disciplines";
import { FindEmployeeProfileResponses } from "@infra/config/swagger/responses/employee/find-employee-profile";
import { FindEmployeeProfileUseCase } from "@use-cases/employee/find-employee-profile";
import { FindThreeLastModulesEmployeeResponses } from "@infra/config/swagger/responses/employee/find-three-last-modules";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { EmployeeModuleTrailUseCase } from "@use-cases/employee/find-module-trail";
import { FindModuleTrailResponses } from "@infra/config/swagger/responses/employee/find-discipline-trail";
import {
  FindEmployeeProgressUseCase,
  FindEmployeeProgressUseCaseResponse
} from "@use-cases/employee/progress";
import { FindEmployeeProgressResponses } from "@infra/config/swagger/responses/employee/find-progress";
import { FindAllEmployeeModulesByDisciplineUseCase } from "@use-cases/employee/find-all-missions-by-discipline";
import { FindThreeLastModulesEmployeeUseCase } from "@use-cases/employee/find-three-last-missions";
import { FindAllEmployeeModulesByDisciplineResponses } from "@infra/config/swagger/responses/employee/find-all-modules-by-discipline";
import { GetCurrentUser } from "@infra/commons/decorators/get-current-user";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { CreateEmployeeMultiPartBody } from "@infra/config/swagger/body/employee/create";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { UpdateEmployeeMultiPartBody } from "@infra/config/swagger/body/employee/edit";
import { UpdateEmployeeResponses } from "@infra/config/swagger/body/employee/update";

@ApiTags("Employee")
@Controller("employee")
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly createEmployeeWithCsvUseCase: CreateEmployeeWithCsvUseCase,
    private readonly findAllEmployeesUseCase: FindAllEmployeesPaginatedUseCase,
    private readonly findAllEmployeesByServiceProviderIdNoPaginationUseCase: FindAllEmployeesByServiceProviderIdNoPaginationUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    private readonly addEmployeeSolecasUseCase: AddEmployeeSolecasUseCase,
    private readonly findAllDisciplinesByEmployeeIdUseCase: FindAllDisciplinesByEmployeeIdUseCase,
    private readonly findEmployeeProfileUseCase: FindEmployeeProfileUseCase,
    private readonly findAllEmployeeModulesByDisciplineUseCase: FindAllEmployeeModulesByDisciplineUseCase,
    private readonly findThreeLastModulesEmployeeUseCase: FindThreeLastModulesEmployeeUseCase,
    private readonly employeeModuleTrailUseCase: EmployeeModuleTrailUseCase,
    private readonly findEmployeeProgressUseCase: FindEmployeeProgressUseCase
  ) {}

  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @Post()
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @CreateEmployeeMultiPartBody
  @CreateEmployeeResponses
  async create(
    @Body() body: CreateEmployeeDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: { file?: Express.Multer.File[] }
  ): Promise<void> {
    const employeeAvatar = file?.file?.[0] || null;

    return this.createEmployeeUseCase.create(body, employeeAvatar);
  }

  @AuthWithRoleDecorator([
    RoleValue.OPERATOR,
    RoleValue.ADMIN,
    RoleValue.SERVICE_PROVIDER
  ])
  @Post("create-csv")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateEmployeeWithCsvDTO })
  @UseInterceptors(FileInterceptor("file"))
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @Query("serviceProviderId") serviceProviderId: string
  ): Promise<void> {
    return this.createEmployeeWithCsvUseCase.execute(
      file.buffer,
      serviceProviderId
    );
  }

  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @Get("all")
  @FindAllEmployeesResponse
  async findAll(
    @Query("serviceProviderId") serviceProviderId: string,
    @Query("page") page: number,
    @Query("pageSize") pageSize: number
  ): Promise<PaginatedEntity<FindAllEmployeesReturn> | void> {
    return this.findAllEmployeesUseCase.execute({
      serviceProviderId,
      page,
      pageSize
    });
  }

  @Get("all/service-provider/:serviceProviderId/no-pagination")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindAllEmployeesByServiceProviderIdNoPaginationResponse
  async findAllByServiceProviderIdNoPagination(
    @Param("serviceProviderId") serviceProviderId: string
  ): Promise<FindAllEmployeeNoPaginationByServiceProviderIdResponse[] | void> {
    return await this.findAllEmployeesByServiceProviderIdNoPaginationUseCase.execute(
      serviceProviderId
    );
  }

  @HttpCode(204)
  @Patch(":employeeId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateEmployeeMultiPartBody
  @UpdateEmployeeResponses
  async update(
    @Param("employeeId") employeeId: string,
    @Body() body: UpdateEmployeeDto,
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

    return await this.updateEmployeeUseCase.execute(
      employeeId,
      body,
      newAvatar
    );
  }

  @Get(":employeeId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindEmployeeByIdResponses
  async findById(
    @Param("employeeId") employeeId: string
  ): Promise<UserWithEmployee | void> {
    return await this.findEmployeeByIdUseCase.execute(employeeId);
  }

  @Patch("add-solecas/:employeeId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.EMPLOYEE])
  @AddEmployeeSolecasResponses
  async addSolecas(
    @Param("employeeId") employeeId: string,
    @Body() body: AddSolecasDTO,
    @GetCurrentUser() user: User
  ): Promise<AddEmployeeSolecasUseCaseResponse | void> {
    const { solecasValueToAdd } = body;

    return await this.addEmployeeSolecasUseCase.execute({
      userParam: user,
      employeeId,
      solecasToAdd: solecasValueToAdd
    });
  }

  @Get("disciplines/:employeeId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllEmployeeDisciplinesResponses
  async findAllDisciplines(
    @Param("employeeId") employeeId: string
  ): Promise<FindAllDisciplineByEmployeeIdResponse[] | void> {
    return await this.findAllDisciplinesByEmployeeIdUseCase.execute(employeeId);
  }

  @Get("profile/:employeeId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindEmployeeProfileResponses
  async findEmployeeProfile(
    @Param("employeeId") employeeId: string
  ): Promise<FindEmployeeProfileResponse | void> {
    return await this.findEmployeeProfileUseCase.execute(employeeId);
  }

  @Get("three-last-modules/:employeeId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindThreeLastModulesEmployeeResponses
  async findThreeLastModules(
    @Param("employeeId") employeeId: string
  ): Promise<CardResponse[] | void> {
    return await this.findThreeLastModulesEmployeeUseCase.execute(employeeId);
  }

  @Get(":employeeId/modules-in-discipline/:disciplineId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindAllEmployeeModulesByDisciplineResponses
  async findAllModulesByDiscipline(
    @Param("employeeId") employeeId: string,
    @Param("disciplineId") disciplineId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<CardResponseWithoutLastAttempt> | void> {
    const { page, pageSize } = query;

    return await this.findAllEmployeeModulesByDisciplineUseCase.execute({
      disciplineId,
      employeeId,
      page,
      pageSize
    });
  }

  @Get(":employeeId/module/:moduleId/trail")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindModuleTrailResponses
  async findDisciplineTrail(
    @Param("employeeId") employeeId: string,
    @Param("moduleId") moduleId: string
  ): Promise<FindModuleTrailResponse | void> {
    return await this.employeeModuleTrailUseCase.execute({
      moduleId,
      employeeId
    });
  }

  @Get(":employeeId/progress")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindEmployeeProgressResponses
  async findProgress(
    @Param("employeeId") employeeId: string
  ): Promise<FindEmployeeProgressUseCaseResponse | void> {
    return await this.findEmployeeProgressUseCase.execute(employeeId);
  }
}
