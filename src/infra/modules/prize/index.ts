import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { PrizeController } from "@infra/controllers/prize";
import { CreatePrizeUseCase } from "@use-cases/prize/create";
import { FindAllPrizesUseCase } from "@use-cases/prize/find-all";
import { UpdatePrizeUseCase } from "@use-cases/prize/update";
import { DeletePrizeUseCase } from "@use-cases/prize/delete";
import { FindPrizeByIdUseCase } from "@use-cases/prize/find-by-id";
import { FileModule } from "../file-storage";

@Module({
  imports: [DatabaseModule, ExceptionsModule, FileModule],
  controllers: [PrizeController],
  providers: [
    CreatePrizeUseCase,
    FindAllPrizesUseCase,
    UpdatePrizeUseCase,
    DeletePrizeUseCase,
    FindPrizeByIdUseCase
  ]
})
export class PrizeModule {}
