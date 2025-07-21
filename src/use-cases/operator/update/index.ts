import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";
import { UserRepository } from "@domain/repositories/user";
import { User } from "@domain/entities/base-user";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdateOperatorUseCaseParams {
  operatorId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  cnpj?: string;
  responsible?: string;
  newAvatar?: Express.Multer.File;
}

@Injectable()
export class UpdateOperatorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(params: UpdateOperatorUseCaseParams): Promise<User | void> {
    const { operatorId, email, phone, cnpj, newAvatar } = params;

    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      return this.exceptionsAdapter.notFound({
        message: "Operator not found"
      });
    }

    if (email && email !== operator.email) {
      const existingUserWithEmail =
        await this.userRepository.findByEmail(email);
      if (existingUserWithEmail) {
        return this.exceptionsAdapter.badRequest({
          message: "E-mail already registered"
        });
      }
    }

    if (cnpj && cnpj !== operator.cnpj) {
      const existingUserWithCnpj = await this.userRepository.findByCnpj(cnpj);
      if (existingUserWithCnpj) {
        return this.exceptionsAdapter.badRequest({
          message: `A user with CNPJ ${cnpj} already exists`
        });
      }
    }

    if (phone && phone !== operator.phone) {
      const existingUserWithPhone =
        await this.userRepository.findByPhone(phone);
      if (existingUserWithPhone) {
        return this.exceptionsAdapter.badRequest({
          message: `A user with phone ${phone} already exists`
        });
      }
    }

    const isAutomaticAvatar =
      operator.avatar?.includes("avatar.iran.liara.run") ?? false;

    let newAvatarPath = null;

    if (newAvatar) {
      if (operator.avatar && !isAutomaticAvatar) {
        const deleteOldAvatar = await this.fileStorage.deleteFile(
          operator.avatar
        );

        if (!deleteOldAvatar) {
          return this.exceptionsAdapter.internalServerError({
            message: "Error deleting old avatar"
          });
        }
      }

      newAvatarPath = await this.uploadFileUseCase.upload(
        newAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!newAvatarPath) {
        return this.exceptionsAdapter.internalServerError({
          message: "Error upload avatar"
        });
      }
    }

    const updatedOperator = await this.operatorRepository.updateOperator({
      ...params,
      avatar: newAvatarPath ?? null
    });

    if (updatedOperator) {
      delete updatedOperator.password;
    }

    return updatedOperator;
  }
}
