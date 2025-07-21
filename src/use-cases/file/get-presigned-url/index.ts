import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Injectable } from "@nestjs/common";

export interface GetFilePresignedUrlUseCaseParams {
  folder: StorageFolderPaths;
  fileId: string;
}

@Injectable()
export class GetFilePresignedUrlUseCase {
  constructor(
    private readonly fileStorageAdapter: FileStorageAdapter,
    protected readonly exceptionsService: ExceptionsAdapter
  ) {}

  async execute({
    folder,
    fileId
  }: GetFilePresignedUrlUseCaseParams): Promise<string | void> {
    const path = `${folder}/${fileId}`;

    const filePresignedUrl =
      await this.fileStorageAdapter.getFilePresignedUrl(path);

    if (!filePresignedUrl) {
      return this.exceptionsService.notFound({
        message: `File not found with path: ${path}`
      });
    }

    return filePresignedUrl;
  }
}
