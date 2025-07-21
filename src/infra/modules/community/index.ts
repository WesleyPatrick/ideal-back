import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { CommunityController } from "@infra/controllers/community";
import { CreateCommunityUseCase } from "@use-cases/community/create";
import { FindAllCommunitiesUseCase } from "@use-cases/community/find-all";
import { UpdateCommunityUseCase } from "@use-cases/community/update";
import { DeleteCommunityUseCase } from "@use-cases/community/delete";
import { CommunityEmployeeAssociationModule } from "../assign-employees-to-community-job";
import { FindCommunityByIdUseCase } from "@use-cases/community/find-by-id";
import { FileModule } from "../file-storage";
import { FindCommunitiesByOperatorIdUseCase } from "@use-cases/community/find-by-operatorId";
import { FindCommunitiesByServiceProviderIdUseCase } from "@use-cases/community/find-by-service-provider-id";

@Module({
  imports: [
    DatabaseModule,
    ExceptionsModule,
    CommunityEmployeeAssociationModule,
    FileModule
  ],
  controllers: [CommunityController],
  providers: [
    CreateCommunityUseCase,
    FindAllCommunitiesUseCase,
    UpdateCommunityUseCase,
    DeleteCommunityUseCase,
    FindCommunityByIdUseCase,
    FindCommunitiesByOperatorIdUseCase,
    FindCommunitiesByServiceProviderIdUseCase
  ]
})
export class CommunityModule {}
