import { FileValidator as NestFileValidator } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";
import { UploadFilesValidatorUseCase } from "@use-cases/file/upload-file-validator";

export class FilesValidator extends NestFileValidator {
  constructor(
    private readonly uploadFilesValidatorUseCase: UploadFilesValidatorUseCase
  ) {
    super({});
  }

  isValid(files?: Record<string, IFile[]>): boolean {
    return this.uploadFilesValidatorUseCase.validateFiles(files);
  }

  buildErrorMessage(): string {
    return this.uploadFilesValidatorUseCase.buildErrorMessage();
  }
}
