import { Community } from "@domain/entities/community";
import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
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
import { CreateCommunityUseCase } from "@use-cases/community/create";
import { DeleteCommunityUseCase } from "@use-cases/community/delete";
import { FindAllCommunitiesUseCase } from "@use-cases/community/find-all";
import { UpdateCommunityUseCase } from "@use-cases/community/update";
import { CreateCommunityDto } from "./dtos/create";
import { PaginatedEntity } from "@domain/entities/pagination";
import { UpdateCommunityDto } from "./dtos/update";
import { CreateCommunityResponses } from "@infra/config/swagger/responses/community/create";
import { FindAllCommunitiesResponses } from "@infra/config/swagger/responses/community/find-all";
import { UpdateCommunityResponses } from "@infra/config/swagger/responses/community/update";
import { DeleteCommunityResponses } from "@infra/config/swagger/responses/community/delete";
import { FindAllCommunitiesDTO } from "./dtos/find-all";
import { FindCommunityByIdResponses } from "@infra/config/swagger/responses/community/find-by-id";
import { FindCommunityByIdUseCase } from "@use-cases/community/find-by-id";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { CreatedCommunityMultiPartBody } from "@infra/config/swagger/body/community/create";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { UpdateCommunityMultiPartBody } from "@infra/config/swagger/body/community/update";
import { FindCommunitiesByOperatorIdUseCase } from "@use-cases/community/find-by-operatorId";
import { FindCommunitiesByServiceProviderIdUseCase } from "@use-cases/community/find-by-service-provider-id";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { FindAllCommunitiesByServiceProviderIdResponses } from "@infra/config/swagger/responses/community/find-by-service-provider-id";
import { FindAllCommunitiesByOperatorIdResponses } from "@infra/config/swagger/responses/community/find-by-operator-id";

@Controller("community")
export class CommunityController {
  constructor(
    private readonly createCommunityUseCase: CreateCommunityUseCase,
    private readonly findAllCommunitiesUseCase: FindAllCommunitiesUseCase,
    private readonly updateCommunityUseCase: UpdateCommunityUseCase,
    private readonly deleteCommunityUseCase: DeleteCommunityUseCase,
    private readonly findCommunityByIdUseCase: FindCommunityByIdUseCase,
    private readonly findCommunitiesByOperatorIdUseCase: FindCommunitiesByOperatorIdUseCase,
    private readonly findCommunitiesByServiceProviderIdUseCase: FindCommunitiesByServiceProviderIdUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @CreatedCommunityMultiPartBody
  @CreateCommunityResponses
  async create(
    @Body() body: CreateCommunityDto,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE]
      })
    )
    file: { file: Express.Multer.File[] }
  ): Promise<Community | void> {
    const communityCover = file?.file?.[0] || null;

    return await this.createCommunityUseCase.execute(body, communityCover);
  }

  @Get("all")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindAllCommunitiesResponses
  async findAll(
    @Query() query: FindAllCommunitiesDTO
  ): Promise<PaginatedEntity<Community>> {
    const { page, pageSize, name } = query;

    return await this.findAllCommunitiesUseCase.execute({
      name,
      page,
      pageSize
    });
  }

  @Patch(":communityId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateCommunityMultiPartBody
  @UpdateCommunityResponses
  async update(
    @Param("communityId") communityId: string,
    @Body() body: UpdateCommunityDto,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file?: { file?: Express.Multer.File[] }
  ): Promise<Community | void> {
    const { author, name, resume } = body;

    const newCoverImage = file?.file?.[0] || null;

    return await this.updateCommunityUseCase.execute(
      communityId,
      {
        author,
        name,
        resume
      },
      newCoverImage
    );
  }

  @HttpCode(204)
  @Delete(":communityId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @DeleteCommunityResponses
  async remove(@Param("communityId") communityId: string): Promise<void> {
    return await this.deleteCommunityUseCase.execute(communityId);
  }

  @Get(":communityId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindCommunityByIdResponses
  async findById(
    @Param("communityId") communityId: string
  ): Promise<Community | void> {
    return await this.findCommunityByIdUseCase.execute(communityId);
  }

  @Get("all/operator/:operatorId")
  @AuthWithRoleDecorator([RoleValue.OPERATOR])
  @FindAllCommunitiesByOperatorIdResponses
  async findAllByOperatorId(
    @Param("operatorId") operatorId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<Community> | void> {
    const { page, pageSize } = query;

    return await this.findCommunitiesByOperatorIdUseCase.execute(operatorId, {
      page,
      pageSize
    });
  }

  @Get("all/service-provider/:serviceProviderId")
  @AuthWithRoleDecorator([RoleValue.OPERATOR])
  @FindAllCommunitiesByServiceProviderIdResponses
  async findAllByServiceProviderIdId(
    @Param("serviceProviderId") serviceProviderId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<Community> | void> {
    const { page, pageSize } = query;

    return await this.findCommunitiesByServiceProviderIdUseCase.execute(
      serviceProviderId,
      {
        page,
        pageSize
      }
    );
  }
}
