import { Injectable } from "@nestjs/common";
import { User, UserWithOperator } from "@domain/entities/base-user";
import { CreateUserParams } from "./user";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Operator } from "@domain/entities/operator";

export interface FindAllOperatorsReturn {
  id: string;
  name: string;
  responsible: string | null;
  avatar: string | null;
  serviceProvidersCount: number;
  employeesCount: number;
}

export interface FindOperatorByIdReturn {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  serviceProvidersCount: number;
  employeesCount: number;
  formation: number;
}

export interface UpdateOperatorParams {
  operatorId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
}

export interface FindAllNoPaginationResponse {
  id: string;
  userId: string;
  name: string;
}

@Injectable()
export abstract class OperatorRepository {
  abstract createOperator(params: CreateUserParams): Promise<User | void>;
  abstract updateOperator(params: UpdateOperatorParams): Promise<User | void>;
  abstract findById(id: string): Promise<FindOperatorByIdReturn | null>;
  abstract findAll(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllOperatorsReturn>>;
  abstract findAllNoPagination(): Promise<FindAllNoPaginationResponse[]>;
  abstract findByIdAndReturnOperator(
    operatorId: string
  ): Promise<Operator | null>;
  abstract findByUserId(userId: string): Promise<UserWithOperator>;
}
