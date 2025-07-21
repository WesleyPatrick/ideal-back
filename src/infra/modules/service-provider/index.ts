import { Module } from "@nestjs/common";
import { CryptographyModule } from "@infra/modules/cryptography";
import { ExceptionsModule } from "@infra/modules/exceptions";
import { TokenModule } from "../token";
import { DatabaseModule } from "../database";
import { ServiceProviderController } from "@infra/controllers/service-provider";
import { CreateServiceProviderUseCase } from "@use-cases/service-provider/create";
import { CreateServiceProviderWithCsvUseCase } from "@use-cases/service-provider/create-csv";
import { FindAllServiceProvidersUseCase } from "@use-cases/service-provider/find-all-paginated";
import { FindAllServicesProvidersNoPaginationByOperatorIdUseCase } from "@use-cases/service-provider/find-all-no-pagination-by-operatorId";
import { UpdateServiceProviderUseCase } from "@use-cases/service-provider/update";
import { FindServiceProviderByIdUseCase } from "@use-cases/service-provider/find-by-id";
import { FileModule } from "../file-storage";

@Module({
  imports: [
    DatabaseModule,
    TokenModule,
    CryptographyModule,
    ExceptionsModule,
    FileModule
  ],
  controllers: [ServiceProviderController],
  providers: [
    CreateServiceProviderUseCase,
    CreateServiceProviderWithCsvUseCase,
    FindAllServiceProvidersUseCase,
    FindAllServicesProvidersNoPaginationByOperatorIdUseCase,
    UpdateServiceProviderUseCase,
    FindServiceProviderByIdUseCase
  ]
})
export class ServiceProviderModule {}
