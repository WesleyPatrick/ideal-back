import { BaseEntity } from "./base-entity";

export class Response extends BaseEntity {
  text: string;
  isCorrect: boolean;
  multipleResponseActivityId: string;
}
