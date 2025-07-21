import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  FileWithMetadata,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Injectable } from "@nestjs/common";

export class GetFileUseCaseParams {
  folder: StorageFolderPaths;
  fileId: string;
}

@Injectable()
export class GetFileUseCase {
  constructor(
    private readonly fileStorageService: FileStorageAdapter,
    protected readonly exceptionsService: ExceptionsAdapter
  ) {}

  async get({
    folder,
    fileId
  }: GetFileUseCaseParams): Promise<FileWithMetadata | void> {
    const path = `${folder}/${fileId}`;

    const file = await this.fileStorageService.getFile(path);

    if (!file.data) {
      return this.exceptionsService.notFound({
        message: `File not found with path: ${path}`
      });
    }

    return file;
  }
}
