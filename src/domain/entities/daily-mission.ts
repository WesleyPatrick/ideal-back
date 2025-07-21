import { BaseEntity } from "./base-entity";

export class DailyMission extends BaseEntity {
  startAt: Date;
  endAt: Date;
  solecasAmount: number;
  missionId: string;
  profileId: string;
}
