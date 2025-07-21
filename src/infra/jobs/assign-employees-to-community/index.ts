import { AssignEmployeesToCommunityParams } from "@domain/adapters/assign-employee-to-community";
import { PrismaService } from "@infra/config/prisma";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

export const COMMUNITY_QUEUE = "community-queue";
export const ASSIGN_EMPLOYEES_JOB = "assign_employees_job";

@Processor(COMMUNITY_QUEUE)
export class AssignEmployeesToCommunityJob extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<AssignEmployeesToCommunityParams>): Promise<void> {
    const { communityId, profileId } = job.data;

    const employees = await this.prisma.employee.findMany({
      where: {
        profileId
      },
      select: {
        id: true
      }
    });

    if (employees.length === 0) {
      return;
    }

    const dataToInsert = employees.map((employee) => ({
      employeeId: employee.id,
      communityId
    }));

    await this.prisma.employeeCommunity.createMany({
      data: dataToInsert,
      skipDuplicates: true
    });
  }
}
