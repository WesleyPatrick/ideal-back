import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { StepController } from "@infra/controllers/step";
import { FindAllStepsByMissionId } from "@use-cases/step/find-by-missionId";
import { FindAllActivitiesInStepUseCase } from "@use-cases/step/find-all-activies-in-step";
import { FindAllActivitiesInDailyMissionStepUseCase } from "@use-cases/step/find-all-activities-in-daily-mission-step";

@Module({
  imports: [DatabaseModule, ExceptionsModule],
  controllers: [StepController],
  providers: [
    FindAllStepsByMissionId,
    FindAllActivitiesInStepUseCase,
    FindAllActivitiesInDailyMissionStepUseCase
  ]
})
export class StepModule {}
