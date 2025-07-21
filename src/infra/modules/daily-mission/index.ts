import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { DailyMissionController } from "@infra/controllers/daily-mission";
import { DateModule } from "../date";
import { CreateDailyMissionUseCase } from "@use-cases/daily-mission/create";
import { FindAllDailyMissionUseCase } from "@use-cases/daily-mission/find-all";
import { FindDailyMissionTrailUseCase } from "@use-cases/daily-mission/find-mission-trail";

@Module({
  imports: [DatabaseModule, ExceptionsModule, DateModule],
  controllers: [DailyMissionController],
  providers: [
    CreateDailyMissionUseCase,
    FindAllDailyMissionUseCase,
    FindDailyMissionTrailUseCase
  ]
})
export class DailyMissionModule {}
