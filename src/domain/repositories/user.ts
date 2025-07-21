import { User } from "@domain/entities/base-user";
import { Injectable } from "@nestjs/common";
import { RoleValue } from "@domain/entities/roles";

export interface CreateUserParams {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  role: RoleValue;
  state: string;
  city: string;
  address: string;
  cnpj?: string;
  responsible?: string;
  avatar?: string;
}

export interface CreateAdminUserParams {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  city: string;
  address: string;
  role: RoleValue;
  avatar?: string;
}

export interface UpdateUserParams {
  name?: string;
  avatar?: string;
}

export interface RankingResponse {
  userId: string;
  userName: string;
  userAvatar: string;
  serviceProviderName: string;
  missionConclusionCount: number;
  userSolecas: number;
}

export interface UserDetailsResponse {
  percentageComplete: number;
  percentageAccurancy: number;
  address: string;
  phone: string;
  email: string;
}

export interface CardModuleResponse {
  moduleName: string;
  missionsCount: number;
  percentageComplete: number;
  percentageAccurancy: number;
}

@Injectable()
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByPhone(phone: string): Promise<boolean>;
  abstract findByCpf(cpf: string): Promise<boolean>;
  abstract findByCnpj(cnpj: string): Promise<boolean>;
  abstract createBaseUser(params: CreateUserParams): Promise<User | void>;
  abstract updatedSolecas(
    userId: string,
    newSolecasValue: number
  ): Promise<number>;
  abstract findAllUsersIdWithoutMe(userId: string): Promise<{ id: string }[]>;
  abstract changeAvatar(
    userId: string,
    newAvatarPath: string
  ): Promise<boolean>;
  abstract createAdmin(params: CreateAdminUserParams): Promise<User>;
  abstract update(userId: string, params: UpdateUserParams): Promise<User>;
  abstract ranking(): Promise<RankingResponse[]>;
  abstract userDetails(userId: string): Promise<UserDetailsResponse>;
  abstract findTwoLastModules(): Promise<CardModuleResponse[]>;
  abstract findTwoLastModulesByOperatorId(
    operatorId: string
  ): Promise<CardModuleResponse[]>;
  abstract findTwoLastModulesByServiceProviderId(
    serviceProviderId: string
  ): Promise<CardModuleResponse[]>;
}
