import { FileValidatorAdapter } from "@domain/adapters/file-validator";
import { IFile } from "@nestjs/common/pipes/file/interfaces";

export class ValidateFileSizeUseCase implements FileValidatorAdapter {
  private readonly MAX_SIZE_MB = 20;

  isValid(file: IFile): boolean {
    const fileSizeInMB = file.size / (1024 * 1024);
    return fileSizeInMB <= this.MAX_SIZE_MB;
  }

  buildErrorMessage(): string {
    return `File uploaded is too big. Max size is ${this.MAX_SIZE_MB} MB`;
  }
}
