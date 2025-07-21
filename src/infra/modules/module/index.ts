import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { ModuleController } from "@infra/controllers/module";
import { DeleteModuleUseCase } from "@use-cases/module/delete";
import { CreateModuleUseCase } from "@use-cases/module/create";
import { EditModuleUseCase } from "@use-cases/module/edit";
import { FindAllModulesByDisciplineId } from "@use-cases/module/find-all-by-disciplineId-no-pagination";
import { FindModuleByDisciplineIdUseCase } from "@use-cases/module/find-by-disciplineId";
import { FindModuleByIdWithRelationsUseCase } from "@use-cases/module/find-with-relations";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [ModuleController],
  providers: [
    DeleteModuleUseCase,
    CreateModuleUseCase,
    EditModuleUseCase,
    FindAllModulesByDisciplineId,
    FindModuleByDisciplineIdUseCase,
    FindModuleByIdWithRelationsUseCase
  ]
})
export class ModuleModule {}
