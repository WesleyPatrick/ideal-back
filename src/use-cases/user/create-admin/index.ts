import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { RoleValue } from "@domain/entities/roles";
import {
  CreateAdminUserParams,
  UserRepository
} from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export type CreateAdminUserUseCaseParams = Omit<CreateAdminUserParams, "role">;

@Injectable()
export class CreateAdminUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsAdapter,
    private readonly cryptography: CryptographyAdapter
  ) {}

  async execute(params: CreateAdminUserUseCaseParams): Promise<void> {
    const { address, city, cpf, email, name, password, phone, state, avatar } =
      params;

    const existingUserWithEmail = await this.userRepository.findByEmail(email);

    if (existingUserWithEmail) {
      return this.exception.badRequest({
        message: "E-mail already registered"
      });
    }

    const existingUserWithCpf = await this.userRepository.findByCpf(cpf);

    if (existingUserWithCpf) {
      return this.exception.badRequest({
        message: `A user with CPF ${cpf} already exists`
      });
    }

    const existingUserWithPhone = await this.userRepository.findByPhone(phone);

    if (existingUserWithPhone) {
      return this.exception.badRequest({
        message: `A user with phone ${phone} already exists`
      });
    }

    const encryptedPassword = await this.cryptography.generateHash(password);

    const adminCreated = await this.userRepository.createAdmin({
      address,
      city,
      cpf,
      email,
      name,
      password: encryptedPassword,
      phone,
      role: RoleValue.ADMIN,
      state,
      avatar
    });

    if (!adminCreated) {
      return this.exception.internalServerError({
        message: "Error to create admin user"
      });
    }
  }
}
