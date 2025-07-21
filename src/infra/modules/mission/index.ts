import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { MissionController } from "@infra/controllers/mission";
import { FindAllMissionByModuleIdUseCase } from "@use-cases/mission/find-all-by-module-id";
import { EditMissionUseCase } from "@use-cases/mission/edit";
import { FindAllMissionsAndStepsByModuleIdUseCase } from "@use-cases/mission/find-all-missions-and-steps-by-moduleId";
import { FindMissionByIdWithRelationsUseCase } from "@use-cases/mission/find-by-id-with-relations";
import { FileModule } from "../file-storage";

@Module({
  imports: [DatabaseModule, ExceptionsModule, FileModule],
  controllers: [MissionController],
  providers: [
    FindAllMissionByModuleIdUseCase,
    EditMissionUseCase,
    FindAllMissionsAndStepsByModuleIdUseCase,
    FindMissionByIdWithRelationsUseCase
  ]
})
export class MissionModule {}
