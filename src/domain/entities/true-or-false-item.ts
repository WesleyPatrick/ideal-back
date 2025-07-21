import { BaseEntity } from "./base-entity";

export class TrueOrFalseItem extends BaseEntity {
  text: string;
  isTrue: boolean;
  trueOrFalseActivityId: string;
}
