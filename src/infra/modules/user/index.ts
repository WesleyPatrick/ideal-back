import { Module } from "@nestjs/common";
import { CryptographyModule } from "@infra/modules/cryptography";
import { ExceptionsModule } from "@infra/modules/exceptions";
import { TokenModule } from "../token";
import { DatabaseModule } from "../database";
import { FindUserByIdUseCase } from "@use-cases/user/find";
import { UserController } from "@infra/controllers/user";
import { SSEModule } from "../sse";
import { SSEConnectUseCase } from "@use-cases/user/connect-sse";
import { GetUserProfileWithRoleUseCase } from "@use-cases/user/get-user-profile";
import { ChangeUserAvatarUseCase } from "@use-cases/user/change-avatar";
import { CreateAdminUserUseCase } from "@use-cases/user/create-admin";
import { FileModule } from "../file-storage";
import { UpdateByUserUseCase } from "@use-cases/user/upgrade-by-user";
import { RankingUseCase } from "@use-cases/user/ranking";
import { FindUserDetailsUseCase } from "@use-cases/user/user-details";
import { FindTwoLastModulesByAdminUseCase } from "@use-cases/user/find-two-last-modules-by-admin";
import { FindTwoLastModulesByOperatorIdUseCase } from "@use-cases/user/find-two-last-modules-by-operator-id";
import { FindTwoLastModulesByServiceProviderIdUseCase } from "@use-cases/user/find-two-last-modules-by-service-provider-id";

@Module({
  imports: [
    DatabaseModule,
    TokenModule,
    CryptographyModule,
    ExceptionsModule,
    SSEModule,
    FileModule
  ],
  controllers: [UserController],
  providers: [
    FindUserByIdUseCase,
    SSEConnectUseCase,
    GetUserProfileWithRoleUseCase,
    ChangeUserAvatarUseCase,
    CreateAdminUserUseCase,
    UpdateByUserUseCase,
    RankingUseCase,
    FindUserDetailsUseCase,
    FindTwoLastModulesByAdminUseCase,
    FindTwoLastModulesByOperatorIdUseCase,
    FindTwoLastModulesByServiceProviderIdUseCase
  ]
})
export class UserModule {}
