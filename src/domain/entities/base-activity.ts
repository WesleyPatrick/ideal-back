import { BaseEntity } from "./base-entity";

export class BaseActivity extends BaseEntity {
  stepPosition: number;
  stepId: string;
  finalTestId?: string;
  solecasAmount: number;
}
