import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@infra/config/env";
import { CryptographyModule } from "../cryptography";
import { ExceptionsModule } from "../exceptions";
import { DatabaseModule } from "../database";
import { AuthenticationModule } from "../authentication";
import { EmployeeModule } from "../employee";
import { ServiceProviderModule } from "../service-provider";
import { OperatorModule } from "../operator";
import { UserModule } from "../user";
import { DisciplineModule } from "../discipline";
import { ModuleModule } from "../module";
import { MissionModule } from "../mission";
import { PrizeModule } from "../prize";
import { StepModule } from "../step";
import { PrizeOrderModule } from "../prize-order";
import { ProfileModule } from "../profile";
import { CacheModule } from "../cache";
import { StatisticModule } from "../statistic";
import { ReportModule } from "../report";
import { ChatModule } from "../chat";
import { BullModule } from "@nestjs/bullmq";
import { env } from "process";
import { CommunityModule } from "../community";
import { CommunityMessageModule } from "../community-message";
import { ActivityModule } from "../activity";
import { FinalTestModule } from "../final-test";
import { ConclusionModule } from "../conclusion";
import { DailyMissionModule } from "../daily-mission";
import { FileModule } from "../file-storage";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT)
      }
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true
    }),
    CryptographyModule,
    ExceptionsModule,
    UserModule,
    DatabaseModule,
    AuthenticationModule,
    EmployeeModule,
    ServiceProviderModule,
    OperatorModule,
    DisciplineModule,
    ModuleModule,
    MissionModule,
    PrizeModule,
    StepModule,
    PrizeOrderModule,
    ProfileModule,
    CacheModule,
    StatisticModule,
    ReportModule,
    ChatModule,
    CommunityModule,
    CommunityMessageModule,
    ActivityModule,
    FinalTestModule,
    ConclusionModule,
    DailyMissionModule,
    FileModule
  ]
})
export class AppModule {}
