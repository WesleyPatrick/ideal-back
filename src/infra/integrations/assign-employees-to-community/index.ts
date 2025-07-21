import {
  AssignEmployeesToCommunityParams,
  CommunityEmployeeAssociationAdapter
} from "@domain/adapters/assign-employee-to-community";
import {
  ASSIGN_EMPLOYEES_JOB,
  COMMUNITY_QUEUE
} from "@infra/jobs/assign-employees-to-community";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class CommunityEmployeeAssociationIntegration
  implements CommunityEmployeeAssociationAdapter
{
  constructor(
    @InjectQueue(COMMUNITY_QUEUE)
    private readonly queue: Queue
  ) {}

  async assignEmployeesToCommunity(
    params: AssignEmployeesToCommunityParams
  ): Promise<void> {
    const { communityId, profileId } = params;

    await this.queue.add(ASSIGN_EMPLOYEES_JOB, {
      communityId,
      profileId
    });
  }
}
