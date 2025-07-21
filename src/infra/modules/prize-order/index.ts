import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { PrizeOrderController } from "@infra/controllers/prize-order";
import { CreatePrizeOrderUseCase } from "@use-cases/prize-order/create";
import { FindAllPrizeOrderUseCase } from "@use-cases/prize-order/find-all";
import { FindAllOperatorsByPrizeIdUseCase } from "@use-cases/prize-order/find-operators-by-prizeId";
import { FindServicesProvidersByPrizeIdAndOperatorIdUseCase } from "@use-cases/prize-order/find-services-providers-by-operatorId-and-prizeId";
import { FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase } from "@use-cases/prize-order/find-employees";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [PrizeOrderController],
  providers: [
    CreatePrizeOrderUseCase,
    FindAllPrizeOrderUseCase,
    FindAllOperatorsByPrizeIdUseCase,
    FindServicesProvidersByPrizeIdAndOperatorIdUseCase,
    FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase
  ]
})
export class PrizeOrderModule {}
