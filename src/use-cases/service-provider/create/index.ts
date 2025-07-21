import { Injectable } from "@nestjs/common";
import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { UserRepository } from "@domain/repositories/user";
import { RoleValue } from "@domain/entities/roles";
import { OperatorRepository } from "@domain/repositories/operator";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { StorageFolderPaths } from "@domain/adapters/file-storage";

export interface CreateServiceProviderUseCaseParams {
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
  operatorId: string;
}

@Injectable()
export class CreateServiceProviderUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async create(
    params: CreateServiceProviderUseCaseParams,
    serviceProviderAvatar?: Express.Multer.File
  ): Promise<{ id: string } | void> {
    const { email, cpf, phone, password, cnpj, operatorId } = params;

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

    const operatorExists = await this.operatorRepository.findById(operatorId);

    if (!operatorExists) {
      return this.exceptionsAdapter.badRequest({
        message: `Operator with ID ${operatorId} does not exist`
      });
    }

    const encryptedPassword =
      await this.cryptographyAdapter.generateHash(password);

    let serviceProviderAvatarUrl = undefined;

    if (serviceProviderAvatar) {
      serviceProviderAvatarUrl = await this.uploadFileUseCase.upload(
        serviceProviderAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!serviceProviderAvatarUrl) {
        return this.exceptionsAdapter.internalServerError({
          message: "Error upload avatar"
        });
      }
    }

    const serviceProviderId =
      await this.serviceProviderRepository.createServiceProvider({
        ...params,
        avatar: serviceProviderAvatarUrl,
        role: RoleValue.SERVICE_PROVIDER,
        password: encryptedPassword
      });

    if (!serviceProviderId) {
      return this.exceptionsAdapter.badRequest({
        message: "Error creating service provider"
      });
    }

    return {
      id: serviceProviderId
    };
  }
}
