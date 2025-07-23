import { User } from "@domain/entities/base-user";
import { RoleValue } from "@domain/entities/roles";
import { GetCurrentUser } from "@infra/commons/decorators/get-current-user";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { ChangeUserAvatarResponses } from "@infra/config/swagger/responses/user/change-avatar";
import { FindUserResponse } from "@infra/config/swagger/responses/user/find";
import { UserWithProfileResponses } from "@infra/config/swagger/responses/user/profile";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChangeUserAvatarUseCase } from "@use-cases/user/change-avatar";
import { SSEConnectUseCase } from "@use-cases/user/connect-sse";
import { FindUserByIdUseCase } from "@use-cases/user/find";
import { GetUserProfileWithRoleUseCase } from "@use-cases/user/get-user-profile";
import { Response } from "express";
import { CreateAdminResponses } from "@infra/config/swagger/responses/user/create-admin";
import { CreateAdminUserUseCase } from "@use-cases/user/create-admin";
import { CreateAdminDTO } from "./dto/create-admin";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { UpdateUserAvatarMultiPartBody } from "@infra/config/swagger/body/user/change-avatar";
import { UpdateByUserUseCase } from "@use-cases/user/upgrade-by-user";
import { UpdateUserByUserDto } from "./dto/update-by-user";
import { UpdateByUserMultiPartBody } from "@infra/config/swagger/body/user/update-by-user";
import { UpdateUserByUserResponses } from "@infra/config/swagger/responses/user/update";
import { RankingUseCase } from "@use-cases/user/ranking";
import { FindUserDetailsUseCase } from "@use-cases/user/user-details";
import { RankingResponses } from "@infra/config/swagger/responses/user/ranking";
import {
  CardModuleResponse,
  RankingResponse,
  UserDetailsResponse
} from "@domain/repositories/user";
import { UserDetailsResponses } from "@infra/config/swagger/responses/user/details";
import { FindTwoLastModulesByAdminUseCase } from "@use-cases/user/find-two-last-modules-by-admin";
import { FindTwoLastModulesByOperatorIdUseCase } from "@use-cases/user/find-two-last-modules-by-operator-id";
import { FindTwoLastModulesByServiceProviderIdUseCase } from "@use-cases/user/find-two-last-modules-by-service-provider-id";
import { CardModuleResponses } from "@infra/config/swagger/responses/user/card-module";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly sseConnectUseCase: SSEConnectUseCase,
    private readonly getUserProfileWithRoleUseCase: GetUserProfileWithRoleUseCase,
    private readonly changeUserAvatarUseCase: ChangeUserAvatarUseCase,
    private readonly createAdminUserUseCase: CreateAdminUserUseCase,
    private readonly updateByUserUseCase: UpdateByUserUseCase,
    private readonly rankingUseCase: RankingUseCase,
    private readonly findUserDetailsUseCase: FindUserDetailsUseCase,
    private readonly findTwoLastModulesByAdminUseCase: FindTwoLastModulesByAdminUseCase,
    private readonly findTwoLastModulesByOperatorIdUseCase: FindTwoLastModulesByOperatorIdUseCase,
    private readonly findTwoLastModulesByServiceProviderIdUseCase: FindTwoLastModulesByServiceProviderIdUseCase
  ) {}
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.EMPLOYEE,
    RoleValue.SERVICE_PROVIDER
  ])
  @Get(":id")
  @FindUserResponse
  async findById(@Param("id") id: string): Promise<User | void> {
    return this.findUserByIdUseCase.execute(id);
  }

  @Get("connect-sse/:userId")
  connectToSSE(@Param("userId") userId: string, @Res() res: Response): void {
    const decodedUserId = decodeURIComponent(userId);

    return this.sseConnectUseCase.execute({
      userId: decodedUserId,
      res
    });
  }

  @Get("profile/with-role")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.EMPLOYEE,
    RoleValue.SERVICE_PROVIDER
  ])
  @UserWithProfileResponses
  async profileWithRole(@GetCurrentUser() user: User): Promise<unknown> {
    return await this.getUserProfileWithRoleUseCase.execute(user);
  }

  @HttpCode(204)
  @Patch("avatar/:userId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.EMPLOYEE,
    RoleValue.SERVICE_PROVIDER
  ])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateUserAvatarMultiPartBody
  @ChangeUserAvatarResponses
  async changeAvatar(
    @Param("userId") userId: string,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE]
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<void> {
    const newAvatar = file?.file?.[0];

    return await this.changeUserAvatarUseCase.execute({
      newAvatar,
      userId
    });
  }

  @Post("create/admin")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @CreateAdminResponses
  async createAdmin(@Body() body: CreateAdminDTO): Promise<void> {
    return await this.createAdminUserUseCase.execute(body);
  }

  @Patch("update/with-me")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdateByUserMultiPartBody
  @UpdateUserByUserResponses
  async updateEmployeeWithMe(
    @GetCurrentUser() user: User,
    @Body() body: UpdateUserByUserDto,
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

    return await this.updateByUserUseCase.execute(user, body, newAvatar);
  }

  @Get("ranking/employees")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @RankingResponses
  async ranking(): Promise<RankingResponse[]> {
    return await this.rankingUseCase.execute();
  }

  @Get(":userId/details")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @UserDetailsResponses
  async details(
    @Param("userId") userId: string
  ): Promise<UserDetailsResponse | void> {
    return await this.findUserDetailsUseCase.execute(userId);
  }

  @Get("find/last-modules")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CardModuleResponses
  async findTwoLastModulesAdmin(): Promise<CardModuleResponse[]> {
    return await this.findTwoLastModulesByAdminUseCase.execute();
  }

  @Get("find/last-modules/operator/:operatorId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CardModuleResponses
  async findTwoLastModulesByOperator(
    @Param("operatorId") operatorId: string
  ): Promise<CardModuleResponse[] | void> {
    return await this.findTwoLastModulesByOperatorIdUseCase.execute(operatorId);
  }

  @Get("find/last-modules/service-provider/:serviceProviderId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @CardModuleResponses
  async findTwoLastModulesByServiceProvider(
    @Param("serviceProviderId") serviceProviderId: string
  ): Promise<CardModuleResponse[] | void> {
    return await this.findTwoLastModulesByServiceProviderIdUseCase.execute(
      serviceProviderId
    );
  }
}
