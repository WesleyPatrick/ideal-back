import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Prize } from "@domain/entities/prize";
import { PrizeOrder } from "@domain/entities/prize-order";

export interface CreatePrizeOrderParams {
  prizeId: string;
  employeeId: string;
  serviceProviderId: string;
  operatorId: string;
  solecasValue: number;
  solecasRemaining: number;
  moneyValue: number;
}

export interface FindAllPrizeOrderResponse extends Prize {
  soldCount: number;
  totalMoneyValue: number;
  totalSolecasUsed: number;
}

export interface FindOperatorsByPrizeIdResponse {
  id: string;
  name: string;
  avatar: string | null;
}

export interface FindServicesProvidersByPrizeIdResponse {
  id: string;
  name: string;
  avatar: string | null;
  responsible: string;
}

export interface FindEmployeesByPrizeIdParam extends PaginatedParams {
  prizeId: string;
  operatorId: string;
  serviceProviderId: string;
}

export interface FindEmployeesByPrizeIdResponse {
  id: string;
  name: string;
  avatar: string | null;
  solecasUsed: number;
  currentSolecas: number;
}

export abstract class PrizeOrderRepository {
  abstract create(params: CreatePrizeOrderParams): Promise<PrizeOrder>;
  abstract findAll(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllPrizeOrderResponse>>;
  abstract findOperatorsByPrizeId(
    prizeId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindOperatorsByPrizeIdResponse>>;
  abstract findByPrizeId(prizeId: string): Promise<PrizeOrder | null>;
  abstract findServicesProvidersByPrizeIdAndOperatorId(
    prizeId: string,
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindServicesProvidersByPrizeIdResponse>>;
  abstract findByOperatorId(operatorId: string): Promise<PrizeOrder | null>;
  abstract findAllEmployeesByServiceProviderId(
    params: FindEmployeesByPrizeIdParam
  ): Promise<PaginatedEntity<FindEmployeesByPrizeIdResponse>>;
  abstract findByServiceProviderId(
    serviceProviderId: string
  ): Promise<PrizeOrder | null>;
}
