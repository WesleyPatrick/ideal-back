import { BaseEntity } from "./base-entity";

export class ProfileAccess extends BaseEntity {
  profileId: string;
  disciplineId: string;
  moduleId: string;
  missionId: string;
  stepId: string;
}
