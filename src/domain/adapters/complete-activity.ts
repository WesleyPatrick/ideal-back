import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { Injectable } from "@nestjs/common";

export interface CompleteActivityParams {
  userId: string;
  stepId: string;
  activityId: string;
  isCorrect: boolean;
  isDailyMission?: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export abstract class CompleteActivityAdapter {
  abstract completeActivity(params: CompleteActivityParams): Promise<void>;
}
