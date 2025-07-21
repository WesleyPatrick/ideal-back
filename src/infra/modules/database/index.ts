import { Module } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import { UserRepository } from "@domain/repositories/user";
import { PrismaUserRepository } from "@infra/repositories/prisma/user";
import { PrismaOperatorRepository } from "@infra/repositories/prisma/operator";
import { OperatorRepository } from "@domain/repositories/operator";
import { PrismaEmployeeRepository } from "@infra/repositories/prisma/employee";
import { PrismaServiceProviderRepository } from "@infra/repositories/prisma/service-provider";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { EmployeeRepository } from "@domain/repositories/employee";
import { PrismaDisciplineRepository } from "@infra/repositories/prisma/discipline";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { PrismaModuleRepository } from "@infra/repositories/prisma/module";
import { ModuleRepository } from "@domain/repositories/module";
import { PrismaMissionRepository } from "@infra/repositories/prisma/mission";
import { MissionRepository } from "@domain/repositories/mission";
import { PrismaPrizeRepository } from "@infra/repositories/prisma/prize";
import { PrizeRepository } from "@domain/repositories/prize";
import { PrismaProfileRepository } from "@infra/repositories/prisma/profile";
import { ProfileRepository } from "@domain/repositories/profile";
import { PrismaStepRepository } from "@infra/repositories/prisma/step";
import { StepRepository } from "@domain/repositories/step";
import { PrismaPrizeOrderRepository } from "@infra/repositories/prisma/prize-order";
import { PrizeOrderRepository } from "@domain/repositories/prize-order";
import { CacheModule } from "../cache";
import { PrismaStatisticsRepository } from "@infra/repositories/prisma/statistics";
import { StatisticsRepository } from "@domain/repositories/statistics";
import { PrismaReportRepository } from "@infra/repositories/prisma/report";
import { ReportRepository } from "@domain/repositories/report";
import { PrismaChatRepository } from "@infra/repositories/prisma/chat";
import { ChatRepository } from "@domain/repositories/chat";
import { PrismaCommunityRepository } from "@infra/repositories/prisma/community";
import { CommunityRepository } from "@domain/repositories/community";
import { PrismaCommunityMessageRepository } from "@infra/repositories/prisma/community-message";
import { CommunityMessageRepository } from "@domain/repositories/community-message";
import { PrismaActivityRepository } from "@infra/repositories/prisma/activity";
import { ActivityRepository } from "@domain/repositories/activity";
import { PrismaFinalTestRepository } from "@infra/repositories/prisma/final-test";
import { FinalTestRepository } from "@domain/repositories/finalTest";
import { PrismaDailyMissionRepository } from "@infra/repositories/prisma/daily-mission";
import { DailyMissionRepository } from "@domain/repositories/daily-mission";
import { PrismaConclusionRepository } from "@infra/repositories/prisma/conclusion";
import { ConclusionRepository } from "@domain/repositories/conclusion";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    { useClass: PrismaUserRepository, provide: UserRepository },
    { useClass: PrismaOperatorRepository, provide: OperatorRepository },
    { useClass: PrismaEmployeeRepository, provide: EmployeeRepository },
    {
      useClass: PrismaServiceProviderRepository,
      provide: ServiceProviderRepository
    },
    {
      useClass: PrismaDisciplineRepository,
      provide: DisciplineRepository
    },
    {
      useClass: PrismaModuleRepository,
      provide: ModuleRepository
    },
    {
      useClass: PrismaMissionRepository,
      provide: MissionRepository
    },
    {
      useClass: PrismaPrizeRepository,
      provide: PrizeRepository
    },
    {
      useClass: PrismaProfileRepository,
      provide: ProfileRepository
    },
    {
      useClass: PrismaStepRepository,
      provide: StepRepository
    },
    {
      useClass: PrismaPrizeOrderRepository,
      provide: PrizeOrderRepository
    },
    {
      useClass: PrismaStatisticsRepository,
      provide: StatisticsRepository
    },
    {
      useClass: PrismaReportRepository,
      provide: ReportRepository
    },
    {
      useClass: PrismaChatRepository,
      provide: ChatRepository
    },
    {
      useClass: PrismaCommunityRepository,
      provide: CommunityRepository
    },
    {
      useClass: PrismaCommunityMessageRepository,
      provide: CommunityMessageRepository
    },
    {
      useClass: PrismaActivityRepository,
      provide: ActivityRepository
    },
    {
      useClass: PrismaFinalTestRepository,
      provide: FinalTestRepository
    },
    {
      useClass: PrismaConclusionRepository,
      provide: ConclusionRepository
    },
    {
      useClass: PrismaDailyMissionRepository,
      provide: DailyMissionRepository
    }
  ],
  exports: [
    UserRepository,
    OperatorRepository,
    ServiceProviderRepository,
    EmployeeRepository,
    DisciplineRepository,
    MissionRepository,
    ModuleRepository,
    PrizeRepository,
    ProfileRepository,
    StepRepository,
    PrizeOrderRepository,
    StatisticsRepository,
    ReportRepository,
    ChatRepository,
    CommunityRepository,
    CommunityMessageRepository,
    ActivityRepository,
    FinalTestRepository,
    DailyMissionRepository,
    ConclusionRepository
  ]
})
export class DatabaseModule {}
