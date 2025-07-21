import { Injectable } from "@nestjs/common";
import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";
import { UserRepository } from "@domain/repositories/user";
import { RoleValue } from "@domain/entities/roles";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { StorageFolderPaths } from "@domain/adapters/file-storage";

export interface CreateOperatorUseCaseParams {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  city: string;
  address: string;
  cnpj: string;
  responsible?: string;
}

@Injectable()
export class CreateOperatorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async create(
    params: CreateOperatorUseCaseParams,
    operatorAvatar?: Express.Multer.File
  ): Promise<void> {
    const { email, cpf, cnpj, phone, password } = params;

    const existingUserWithEmail = await this.userRepository.findByEmail(email);

    if (existingUserWithEmail) {
      return this.exceptionsAdapter.badRequest({
        message: "E-mail already registered"
      });
    }

    const existingUserWithCnpj = await this.userRepository.findByCnpj(cnpj);

    if (existingUserWithCnpj) {
      return this.exceptionsAdapter.badRequest({
        message: `A user with CNPJ ${cnpj} already exists`
      });
    }

    const existingUserWithCpf = await this.userRepository.findByCpf(cpf);

    if (existingUserWithCpf) {
      return this.exceptionsAdapter.badRequest({
        message: `A user with CPF ${cpf} already exists`
      });
    }

    const existingUserWithPhone = await this.userRepository.findByPhone(phone);

    if (existingUserWithPhone) {
      return this.exceptionsAdapter.badRequest({
        message: `A user with phone ${phone} already exists`
      });
    }

    const encryptedPassword =
      await this.cryptographyAdapter.generateHash(password);

    let avatarPath = undefined;

    if (operatorAvatar) {
      avatarPath = await this.uploadFileUseCase.upload(
        operatorAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!avatarPath) {
        return this.exceptionsAdapter.internalServerError({
          message: "Error to upload operator avatar"
        });
      }
    }

    await this.operatorRepository.createOperator({
      ...params,
      avatar: avatarPath,
      role: RoleValue.OPERATOR,
      password: encryptedPassword
    });
  }
}
