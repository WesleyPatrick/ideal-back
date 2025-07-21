import { BaseEntity } from "./base-entity";
import { Employee } from "./employee";
import { Operator } from "./operator";
import { RoleValue } from "./roles";
import { ServiceProvider } from "./service-provider";

export class User extends BaseEntity {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  role: RoleValue;
  state: string;
  city: string;
  address: string;
  solecas: number;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
}

export class UserWithEmployee extends BaseEntity {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  role: RoleValue;
  state: string;
  city: string;
  address: string;
  solecas: number;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
  employee: Employee;
}

export class UserWithServiceProvider extends BaseEntity {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  role: RoleValue;
  state: string;
  city: string;
  address: string;
  solecas: number;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
  serviceProvider: ServiceProvider;
}

export class UserWithOperator extends BaseEntity {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  role: RoleValue;
  state: string;
  city: string;
  address: string;
  solecas: number;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
  operator: Operator;
}
