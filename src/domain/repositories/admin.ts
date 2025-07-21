import { Injectable } from "@nestjs/common";
import { User } from "@domain/entities/base-user";
import { CreateUserParams } from "./user";

@Injectable()
export abstract class AdminRepository {
  abstract createAdmin(params: CreateUserParams): Promise<User | void>;
}
