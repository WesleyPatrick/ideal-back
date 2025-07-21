import { Module } from "@nestjs/common";
import { CryptographyModule } from "@infra/modules/cryptography";
import { ExceptionsModule } from "@infra/modules/exceptions";
import { TokenModule } from "../token";
import { DatabaseModule } from "../database";
import { CreateOperatorUseCase } from "@use-cases/operator/create";
import { OperatorController } from "@infra/controllers/operator";
import { FindAllOperatorsUseCase } from "@use-cases/operator/find-all";
import { FindOperatorByIdUseCase } from "@use-cases/operator/find-by-id";
import { UpdateOperatorUseCase } from "@use-cases/operator/update";
import { FindAllOperatorsNoPaginationUseCase } from "@use-cases/operator/find-all-no-pagination";
import { FileModule } from "../file-storage";

@Module({
  imports: [
    DatabaseModule,
    TokenModule,
    CryptographyModule,
    ExceptionsModule,
    FileModule
  ],
  controllers: [OperatorController],
  providers: [
    CreateOperatorUseCase,
    FindAllOperatorsUseCase,
    FindOperatorByIdUseCase,
    UpdateOperatorUseCase,
    FindAllOperatorsNoPaginationUseCase
  ]
})
export class OperatorModule {}
