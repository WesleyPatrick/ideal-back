import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { DisciplineController } from "@infra/controllers/discipline";
import { CreateDisciplineUseCase } from "@use-cases/discipline/create";
import { FindAllDisciplinesUseCase } from "@use-cases/discipline/findAll";
import { EditDisciplineUseCase } from "@use-cases/discipline/edit";
import { DeleteDisciplineUseCase } from "@use-cases/discipline/delete";
import { FindDisciplineByIdWithRelations } from "@use-cases/discipline/find-by-id-with-relations";
import { FindAllDisciplineNoPagination } from "@use-cases/discipline/find-all-no-pagination";
import { FindDisciplineByOperatorIdUseCase } from "@use-cases/discipline/find-by-operatorId";
import { FindDisciplineByIdUseCase } from "@use-cases/discipline/findById";
import { FindDisciplinesByOperatorIdNoPaginationUseCase } from "@use-cases/discipline/find-by-operatorId-no-pagination";
import { FileModule } from "../file-storage";

@Module({
  imports: [DatabaseModule, ExceptionsModule, FileModule],
  controllers: [DisciplineController],
  providers: [
    CreateDisciplineUseCase,
    FindAllDisciplinesUseCase,
    FindDisciplineByIdUseCase,
    EditDisciplineUseCase,
    DeleteDisciplineUseCase,
    FindDisciplineByIdWithRelations,
    FindAllDisciplineNoPagination,
    FindDisciplineByOperatorIdUseCase,
    FindDisciplinesByOperatorIdNoPaginationUseCase
  ]
})
export class DisciplineModule {}
