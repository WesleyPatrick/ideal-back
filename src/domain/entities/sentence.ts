import { BaseEntity } from "./base-entity";
import { SentencePersonIconEnum } from "./sentence-person-icon-enum";

export class Sentence extends BaseEntity {
  person: SentencePersonIconEnum;
  index: number;
  text: string;
  dialogActivityId: string;
}
