import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Prize } from "@domain/entities/prize";
import { Injectable } from "@nestjs/common";

export interface CreatePrizeParams {
  name: string;
  solecasValue: number;
  moneyValue: number;
  description: string;
  image?: string;
  color?: string;
  expiryDate: Date;
}

export interface UpdatePrizeParams {
  name?: string;
  solecasValue?: number;
  moneyValue?: number;
  description?: string;
  image?: string;
  color?: string;
  expiryDate?: Date;
}

@Injectable()
export abstract class PrizeRepository {
  abstract create(params: CreatePrizeParams): Promise<Prize>;
  abstract findAll(params: PaginatedParams): Promise<PaginatedEntity<Prize>>;
  abstract update(prizeId: string, params: UpdatePrizeParams): Promise<Prize>;
  abstract findById(prizeId: string): Promise<Prize | null>;
  abstract delete(prizeId: string): Promise<boolean>;
}
