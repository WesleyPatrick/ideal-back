import { Mission } from "@domain/entities/mission";
import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { MissionListResponses } from "@infra/config/swagger/responses/mission/find-all-by-module-id";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UploadedFiles
} from "@nestjs/common";
import { EditMissionUseCase } from "@use-cases/mission/edit";
import { FindAllMissionByModuleIdUseCase } from "@use-cases/mission/find-all-by-module-id";
import { EditMissionDto } from "./dtos/edit";
import { FindAllMissionsAndStepsByModuleIdResponse } from "@domain/repositories/mission";
import { FindAllMissionsAndStepsByModuleIdUseCase } from "@use-cases/mission/find-all-missions-and-steps-by-moduleId";
import { FindAllMissionsAndStepsByModuleIdResponses } from "@infra/config/swagger/responses/mission/find-all-missions-and-steps-by-moduleId";
import { PaginatedEntity } from "@domain/entities/pagination";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import {
  FindMissionByIdWithRelationsUseCase,
  FindMissionByIdWithRelationsUseCaseResponse
} from "@use-cases/mission/find-by-id-with-relations";
import { FindMissionByIdWithRelationsResponses } from "@infra/config/swagger/responses/mission/find-with-relations";
import { EditMissionMultiPartBody } from "@infra/config/swagger/body/mission/edit";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { EditMissionResponses } from "@infra/config/swagger/responses/mission/edit-mission";

@Controller("mission")
export class MissionController {
  constructor(
    private readonly findAllMissionByModuleIdUseCase: FindAllMissionByModuleIdUseCase,
    private readonly editMissionUseCase: EditMissionUseCase,
    private readonly findAllMissionsAndStepByModuleIdUseCase: FindAllMissionsAndStepsByModuleIdUseCase,
    private readonly findMissionByIdWithRelationsUseCase: FindMissionByIdWithRelationsUseCase
  ) {}

  @Get("/all/:moduleId/no-pagination")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @MissionListResponses
  async findAllMissionByModuleId(
    @Param("moduleId") moduleId: string
  ): Promise<Mission[] | void> {
    return await this.findAllMissionByModuleIdUseCase.execute(moduleId);
  }

  @HttpCode(204)
  @Patch(":missionId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FileUploadDecorator([
    { name: "articleFile", maxCount: 1 },
    { name: "imagesFiles", maxCount: 100 }
  ])
  @EditMissionMultiPartBody
  @EditMissionResponses
  async edit(
    @Param("missionId") missionId: string,
    @Body() body: EditMissionDto,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.PDF, MimeTypes.IMAGE]
      })
    )
    files: {
      articleFile?: Express.Multer.File[];
      imagesFiles?: Express.Multer.File[];
    }
  ): Promise<void> {
    const articleFile = files?.articleFile?.[0] || null;
    const imagesFiles = files?.imagesFiles || [];

    return await this.editMissionUseCase.execute(
      missionId,
      body,
      articleFile,
      imagesFiles
    );
  }

  @Get("/steps/:moduleId")
  @AuthWithRoleDecorator([RoleValue.ADMIN, RoleValue.OPERATOR])
  @FindAllMissionsAndStepsByModuleIdResponses
  async findAllMissionsAndStepByModuleId(
    @Param("moduleId") moduleId: string,
    @Query() params: PaginatedDTO
  ): Promise<PaginatedEntity<FindAllMissionsAndStepsByModuleIdResponse> | void> {
    const { page, pageSize } = params;

    return await this.findAllMissionsAndStepByModuleIdUseCase.execute(
      moduleId,
      { page, pageSize }
    );
  }

  @Get(":missionId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindMissionByIdWithRelationsResponses
  async findByIdWithRelations(
    @Param("missionId") missionId: string
  ): Promise<FindMissionByIdWithRelationsUseCaseResponse | void> {
    return await this.findMissionByIdWithRelationsUseCase.execute(missionId);
  }
}
