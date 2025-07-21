import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { ProfileController } from "@infra/controllers/profile";
import { CreateProfileUseCase } from "@use-cases/profile/create";
import { FindProfileByOperatorIdNoPaginationUseCase } from "@use-cases/profile/find-by-operatorId-no-pagination";
import { FindProfilesByMissionIdNoPaginationUseCase } from "@use-cases/profile/find-by-missionId-no-pagination";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [ProfileController],
  providers: [
    CreateProfileUseCase,
    FindProfileByOperatorIdNoPaginationUseCase,
    FindProfilesByMissionIdNoPaginationUseCase
  ]
})
export class ProfileModule {}
