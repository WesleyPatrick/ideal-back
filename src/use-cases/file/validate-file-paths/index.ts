import { Injectable } from "@nestjs/common";
import { GetFileUseCase } from "../get-file";
import { StorageFolderPaths } from "@domain/adapters/file-storage";

@Injectable()
export class ValidateFilePathsUseCase {
  constructor(private readonly getFileUseCase: GetFileUseCase) {}

  async validate(pathsToValidate: string[]): Promise<boolean> {
    for (const path of pathsToValidate) {
      const separatedPath = path.split("/");
      const [folder, fileId] = separatedPath;

      const isExistFile = await this.getFileUseCase.get({
        folder: folder as StorageFolderPaths,
        fileId
      });

      if (!isExistFile) return false;
    }
    return true;
  }
}
