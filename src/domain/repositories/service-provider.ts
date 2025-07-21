import { Injectable } from "@nestjs/common";
import { UserWithServiceProvider } from "@domain/entities/base-user";
import { CreateUserParams } from "./user";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { ServiceProvider } from "@domain/entities/service-provider";

export interface CreateServiceProviderParams extends CreateUserParams {
  operatorId: string;
}

export interface FindAllServiceProviders extends PaginatedParams {
  operatorId: string;
  name: string;
}

export interface FindAllServiceProviderReturn {
  serviceProviderId: string;
  name: string;
  avatar: string;
  responsible: string;
  employees: number;
  solecas: number;
}

export interface FindAllServiceProviderNoPaginationByOperatorIdResponse {
  id: string;
  userId: string;
  name: string;
  operatorId: string;
}

export interface UpdateServiceProviderParams {
  name?: string;
  state?: string;
  city?: string;
  address?: string;
  cnpj?: string;
  responsible?: string;
  password?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

@Injectable()
export abstract class ServiceProviderRepository {
  abstract createServiceProvider(
    params: CreateServiceProviderParams
  ): Promise<string | void>;
  abstract findByIdWithUser(
    id: string
  ): Promise<UserWithServiceProvider | null>;
  abstract findAllPaginated(
    params: FindAllServiceProviders
  ): Promise<PaginatedEntity<FindAllServiceProviderReturn>>;
  abstract findAllNoPaginationByOperatorId(
    operatorId: string
  ): Promise<FindAllServiceProviderNoPaginationByOperatorIdResponse[]>;
  abstract findById(serviceProviderId: string): Promise<ServiceProvider | null>;
  abstract update(
    serviceProviderId: string,
    params: UpdateServiceProviderParams
  ): Promise<ServiceProvider>;
  abstract findByUserId(userId: string): Promise<UserWithServiceProvider>;
}
