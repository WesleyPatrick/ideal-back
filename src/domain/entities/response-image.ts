import { BaseEntity } from "./base-entity";

export class ResponseImage extends BaseEntity {
  imageFile: string;
  isCorrect: boolean;
  imageActivityId: string;
}
