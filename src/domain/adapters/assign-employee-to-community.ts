import { Injectable } from "@nestjs/common";

export interface AssignEmployeesToCommunityParams {
  profileId: string;
  communityId: string;
}

@Injectable()
export abstract class CommunityEmployeeAssociationAdapter {
  abstract assignEmployeesToCommunity(
    params: AssignEmployeesToCommunityParams
  ): Promise<void>;
}
