import { Module } from "@nestjs/common";
import { CryptographyModule } from "@infra/modules/cryptography";
import { ExceptionsModule } from "@infra/modules/exceptions";
import { TokenModule } from "../token";
import { DatabaseModule } from "../database";
import { EmployeeController } from "@infra/controllers/employee";
import { CreateEmployeeUseCase } from "@use-cases/employee/create";
import { CreateEmployeeWithCsvUseCase } from "@use-cases/employee/create-csv";
import { FindAllEmployeesPaginatedUseCase } from "@use-cases/employee/find-all-paginated";
import { FindAllEmployeesByServiceProviderIdNoPaginationUseCase } from "@use-cases/employee/find-all-by-serviceProviderId-no-pagination";
import { UpdateEmployeeUseCase } from "@use-cases/employee/update";
import { FindEmployeeByIdUseCase } from "@use-cases/employee/find-by-id";
import { AddEmployeeSolecasUseCase } from "@use-cases/employee/add-solecas";
import { FindAllDisciplinesByEmployeeIdUseCase } from "@use-cases/employee/find-all-disciplines";
import { FindEmployeeProfileUseCase } from "@use-cases/employee/find-employee-profile";
import { EmployeeModuleTrailUseCase } from "@use-cases/employee/find-module-trail";
import { FindEmployeeProgressUseCase } from "@use-cases/employee/progress";
import { FindAllEmployeeModulesByDisciplineUseCase } from "@use-cases/employee/find-all-missions-by-discipline";
import { FindThreeLastModulesEmployeeUseCase } from "@use-cases/employee/find-three-last-missions";
import { FileModule } from "../file-storage";

@Module({
  imports: [
    DatabaseModule,
    TokenModule,
    CryptographyModule,
    ExceptionsModule,
    FileModule
  ],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CreateEmployeeWithCsvUseCase,
    FindAllEmployeesPaginatedUseCase,
    FindAllEmployeesByServiceProviderIdNoPaginationUseCase,
    UpdateEmployeeUseCase,
    FindEmployeeByIdUseCase,
    AddEmployeeSolecasUseCase,
    FindAllDisciplinesByEmployeeIdUseCase,
    FindAllEmployeeModulesByDisciplineUseCase,
    FindThreeLastModulesEmployeeUseCase,
    FindEmployeeProfileUseCase,
    EmployeeModuleTrailUseCase,
    FindEmployeeProgressUseCase
  ]
})
export class EmployeeModule {}
