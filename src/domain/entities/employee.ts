import { BaseEntity } from "./base-entity";

export class Employee extends BaseEntity {
  userId: string;
  serviceProviderId: string;
  profileId: string;
  communityId?: string;
}
