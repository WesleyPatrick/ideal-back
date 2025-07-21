import {
  User,
  UserWithEmployee,
  UserWithOperator,
  UserWithServiceProvider
} from "@domain/entities/base-user";
import { RoleValue } from "@domain/entities/roles";
import {
  User as PrismaUser,
  Employee as PrismaEmployee,
  Operator as PrismaOperator,
  ServiceProvider as PrismaServiceProvider
} from "@prisma/client";
import { EmployeeMapper } from "./employee-mapper";
import { OperatorMapper } from "./operator-mapper";
import { ServiceProviderMapper } from "./service-provider-mapper";

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as RoleValue,
      state: user.state,
      city: user.city,
      address: user.address,
      solecas: Number(user.solecas),
      cnpj: user.cnpj,
      responsible: user.responsible,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static toDomainWithEmployee(
    user: PrismaUser & { employee: PrismaEmployee }
  ): UserWithEmployee {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as RoleValue,
      state: user.state,
      city: user.city,
      address: user.address,
      solecas: Number(user.solecas),
      cnpj: user.cnpj,
      responsible: user.responsible,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar ?? undefined,
      employee: EmployeeMapper.toDomain(user.employee)
    };
  }

  static toDomainWithServiceProvider(
    user: PrismaUser & { serviceProvider: PrismaServiceProvider }
  ): UserWithServiceProvider {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as RoleValue,
      state: user.state,
      city: user.city,
      address: user.address,
      solecas: Number(user.solecas),
      cnpj: user.cnpj,
      responsible: user.responsible,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar ?? undefined,
      serviceProvider: ServiceProviderMapper.toDomain(user.serviceProvider)
    };
  }

  static toDomainWithOperator(
    user: PrismaUser & { operator: PrismaOperator }
  ): UserWithOperator {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as RoleValue,
      state: user.state,
      city: user.city,
      address: user.address,
      solecas: Number(user.solecas),
      cnpj: user.cnpj,
      responsible: user.responsible,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar ?? undefined,
      operator: OperatorMapper.toDomain(user.operator)
    };
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as RoleValue,
      state: user.state,
      city: user.city,
      address: user.address,
      avatar: user.avatar,
      solecas: BigInt(user.solecas),
      cnpj: user.cnpj,
      responsible: user.responsible,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
