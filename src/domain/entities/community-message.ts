import { BaseEntity } from "./base-entity";

export class CommunityMessage extends BaseEntity {
  fromUserId: string;
  communityId: string;
  content: string;
  readAt?: Date;
}
