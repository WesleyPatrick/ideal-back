import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { FinalTestController } from "@infra/controllers/final-test";
import { FindAllActivitiesInFinalTestUseCase } from "@use-cases/final-test/find-all-activities-in-final-test";
import { EmployeeCanAccessFinalTestUseCase } from "@use-cases/final-test/employee-can-access-final-test";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [FinalTestController],
  providers: [
    FindAllActivitiesInFinalTestUseCase,
    EmployeeCanAccessFinalTestUseCase
  ]
})
export class FinalTestModule {}
