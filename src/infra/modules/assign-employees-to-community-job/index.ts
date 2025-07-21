import { CommunityEmployeeAssociationAdapter } from "@domain/adapters/assign-employee-to-community";
import { PrismaService } from "@infra/config/prisma";
import { CommunityEmployeeAssociationIntegration } from "@infra/integrations/assign-employees-to-community";
import {
  AssignEmployeesToCommunityJob,
  COMMUNITY_QUEUE
} from "@infra/jobs/assign-employees-to-community";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    BullModule.registerQueue({
      name: COMMUNITY_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    })
  ],
  providers: [
    PrismaService,
    AssignEmployeesToCommunityJob,
    {
      useClass: CommunityEmployeeAssociationIntegration,
      provide: CommunityEmployeeAssociationAdapter
    }
  ],
  exports: [
    {
      useClass: CommunityEmployeeAssociationIntegration,
      provide: CommunityEmployeeAssociationAdapter
    }
  ]
})
export class CommunityEmployeeAssociationModule {}
