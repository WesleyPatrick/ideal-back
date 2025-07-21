import { BaseEntity } from "./base-entity";

export class Community extends BaseEntity {
  name: string;
  author: string;
  resume: string;
  cover: string;
  operatorId: string;
  profileId: string;
}
