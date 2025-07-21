import { BaseEntity } from "./base-entity";

export class Message extends BaseEntity {
  toUserId: string;
  fromUserId: string;
  content: string;
  readAt?: Date;
}
