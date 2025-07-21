import { ActivityTypeEnum } from "./activity-type-enum";

export class ActivityAttempt {
  id: string;
  userId: string;
  activityType: ActivityTypeEnum;
  activityId: string;
  stepId: string;
  moduleId: string;
  missionId: string;
  disciplineId: string;
  isCorrect: boolean;
  createdAt: Date;
}
