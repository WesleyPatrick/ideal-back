import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly fileStorageService: FileStorageAdapter,
    private readonly exceptionsService: ExceptionsAdapter
  ) {}

  async upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<string | void> {
    const isFolderInvalid = this.isFolderInvalid(folder);

    if (isFolderInvalid) {
      return this.exceptionsService.badRequest({ message: "Invalid folder" });
    }

    const path = `${folder}/${randomBytes(32).toString("hex")}`;

    const createFilePath = await this.fileStorageService.uploadFile(file, path);

    if (!createFilePath) {
      return this.exceptionsService.internalServerError({
        message: "Error trying to upload file"
      });
    }

    return createFilePath;
  }

  private isFolderInvalid(folder: string): boolean {
    return !Object.values(StorageFolderPaths).includes(
      folder as StorageFolderPaths
    );
  }
}
