import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { User } from "@domain/entities/base-user";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdateByUserUseCaseParams {
  name?: string;
}

@Injectable()
export class UpdateByUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    userParam: User,
    params: UpdateByUserUseCaseParams,
    newAvatar?: Express.Multer.File
  ): Promise<User | void> {
    const { name } = params;

    const user = await this.userRepository.findById(userParam.id);

    const isAutomaticAvatar =
      user.avatar?.includes("avatar.iran.liara.run") ?? false;

    let newAvatarPath = null;

    if (newAvatar) {
      if (user.avatar && !isAutomaticAvatar) {
        const deleteOldAvatar = await this.fileStorage.deleteFile(user.avatar);

        if (!deleteOldAvatar) {
          return this.exception.internalServerError({
            message: "Error deleting old avatar"
          });
        }
      }

      newAvatarPath = await this.uploadFileUseCase.upload(
        newAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!newAvatarPath) {
        return this.exception.internalServerError({
          message: "Error upload avatar"
        });
      }
    }

    const userUpdated = await this.userRepository.update(user.id, {
      avatar: newAvatarPath ?? undefined,
      name: name ?? undefined
    });

    if (!userUpdated) {
      return this.exception.internalServerError({
        message: "Error to update user "
      });
    }

    return userUpdated;
  }
}
