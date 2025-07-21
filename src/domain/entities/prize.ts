import { BaseEntity } from "./base-entity";

export class Prize extends BaseEntity {
  name: string;
  solecasValue: number;
  moneyValue: number;
  description: string;
  image?: string;
  color: string;
  expiryDate: Date;
}
