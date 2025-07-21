import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdateServiceProviderUseCaseParams {
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
}

@Injectable()
export class UpdateServiceProviderUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    serviceProviderId: string,
    params: UpdateServiceProviderUseCaseParams,
    newAvatar?: Express.Multer.File
  ): Promise<void> {
    const {
      address,
      city,
      cnpj,
      cpf,
      email,
      name,
      password,
      phone,
      responsible,
      state
    } = params;

    const serviceProvider =
      await this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProvider) {
      return this.exceptionAdapter.notFound({
        message: "Not found a service provider with this id"
      });
    }

    const user = await this.userRepository.findById(serviceProvider.userId);

    if (email) {
      const existingUserWithEmail =
        await this.userRepository.findByEmail(email);
      if (existingUserWithEmail) {
        return this.exceptionAdapter.badRequest({
          message: "E-mail already registered"
        });
      }
    }

    if (cnpj) {
      const existingUserWithCnpj = await this.userRepository.findByCnpj(cnpj);
      if (existingUserWithCnpj) {
        return this.exceptionAdapter.badRequest({
          message: `A user with CNPJ ${cnpj} already exists`
        });
      }
    }

    if (cpf) {
      const existingUserWithCpf = await this.userRepository.findByCpf(cpf);
      if (existingUserWithCpf) {
        return this.exceptionAdapter.badRequest({
          message: `A user with CPF ${cpf} already exists`
        });
      }
    }

    if (phone) {
      const existingUserWithPhone =
        await this.userRepository.findByPhone(phone);
      if (existingUserWithPhone) {
        return this.exceptionAdapter.badRequest({
          message: `A user with phone ${phone} already exists`
        });
      }
    }

    let newPassword = user.password;
    if (password) {
      const encryptedNewPassword =
        await this.cryptographyAdapter.generateHash(password);

      newPassword = encryptedNewPassword;
    }

    const isAutomaticAvatar =
      user.avatar?.includes("avatar.iran.liara.run") ?? false;

    let newAvatarPath = null;

    if (newAvatar) {
      if (user.avatar && !isAutomaticAvatar) {
        const deleteOldAvatar = await this.fileStorage.deleteFile(user.avatar);

        if (!deleteOldAvatar) {
          return this.exceptionAdapter.internalServerError({
            message: "Error deleting old avatar"
          });
        }
      }

      newAvatarPath = await this.uploadFileUseCase.upload(
        newAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!newAvatarPath) {
        return this.exceptionAdapter.internalServerError({
          message: "Error upload avatar"
        });
      }
    }

    const newServiceProvider = await this.serviceProviderRepository.update(
      serviceProviderId,
      {
        address: address ?? user.address,
        city: city ?? user.city,
        cnpj: cnpj ?? user.cnpj,
        cpf: cpf ?? user.cpf,
        email: email ?? user.email,
        name: name ?? user.name,
        password: newPassword,
        phone: phone ?? user.phone,
        responsible: responsible ?? user.responsible,
        state: state ?? user.state,
        avatar: newAvatarPath ?? user.avatar
      }
    );

    if (!newServiceProvider) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to update a service provider"
      });
    }
  }
}
