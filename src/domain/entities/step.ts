import { BaseEntity } from "./base-entity";

export class Step extends BaseEntity {
  title: string;
  index: number;
  missionId: string;
}
