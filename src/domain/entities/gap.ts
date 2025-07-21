import { BaseEntity } from "./base-entity";

export class Gap extends BaseEntity {
  index: number;
  options: string[];
  correct: string;
  completeSentenceActivityId: string;
}
