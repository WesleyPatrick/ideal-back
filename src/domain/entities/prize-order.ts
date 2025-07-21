import { BaseEntity } from "./base-entity";

export class PrizeOrder extends BaseEntity {
  prizeId: string;
  employeeId: string;
  serviceProviderId: string;
  operatorId: string;
  solecasValue: number;
  solecasRemaining: number;
  moneyValue: number;
}
