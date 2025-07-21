import { ParseFilePipe } from "@nestjs/common";
import { FilesValidator } from ".";
import { ValidateFileSizeUseCase } from "@use-cases/file/validate-size";
import { ValidateFileTypeUseCase } from "@use-cases/file/validate-type";
import {
  FileValidationOptions,
  UploadFilesValidatorUseCase
} from "@use-cases/file/upload-file-validator";

export interface FilesValidatorFactoryOptions extends FileValidationOptions {
  required?: boolean;
}

export class FilesValidatorFactory {
  static useFactory({
    mimeTypes,
    required = true
  }: FilesValidatorFactoryOptions): ParseFilePipe {
    return new ParseFilePipe({
      validators: [
        new FilesValidator(
          new UploadFilesValidatorUseCase(
            new ValidateFileSizeUseCase(),
            new ValidateFileTypeUseCase(),
            {
              mimeTypes
            }
          )
        )
      ],
      fileIsRequired: required
    });
  }
}
