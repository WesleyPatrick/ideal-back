import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface ChangeUserAvatarUseCaseParams {
  userId: string;
  newAvatar: Express.Multer.File;
}

@Injectable()
export class ChangeUserAvatarUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute({
    userId,
    newAvatar
  }: ChangeUserAvatarUseCaseParams): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionAdapter.notFound({
        message: "Not found a user with this id"
      });
    }

    const isAutomaticAvatar =
      user.avatar?.includes("avatar.iran.liara.run") ?? false;

    let newAvatarPath = null;

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

    const userWithNewAvatar = await this.userRepository.changeAvatar(
      userId,
      newAvatarPath
    );

    if (!userWithNewAvatar) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to update user avatar"
      });
    }
  }
}
