import { ValidateFileSizeUseCase } from "../validate-size";
import { MimeTypes, ValidateFileTypeUseCase } from "../validate-type";
import { IFile } from "@nestjs/common/pipes/file/interfaces";

export interface FileValidationOptions {
  mimeTypes: MimeTypes[];
}

export class UploadFilesValidatorUseCase {
  private errorMessage?: string;

  constructor(
    private readonly validateFileSizeUseCase: ValidateFileSizeUseCase,
    private readonly validateFileTypeUseCase: ValidateFileTypeUseCase,
    private readonly options: FileValidationOptions
  ) {}

  validateFiles(files: Record<string, IFile[]> = {}): boolean {
    const fileKeys = Object.keys(files);
    const { mimeTypes } = this.options;

    for (const fileKey of fileKeys) {
      const file = files[fileKey][0];

      const isTypeValid = this.validateFileTypeUseCase.isValid(file, mimeTypes);

      if (!isTypeValid) {
        this.errorMessage =
          this.validateFileTypeUseCase.buildErrorMessage(mimeTypes);

        return false;
      }

      const isSizeValid = this.validateFileSizeUseCase.isValid(file);

      if (!isSizeValid) {
        this.errorMessage = this.validateFileSizeUseCase.buildErrorMessage();

        return false;
      }
    }

    return true;
  }

  buildErrorMessage(): string {
    return this.errorMessage;
  }
}
