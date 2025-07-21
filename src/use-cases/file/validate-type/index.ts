import { FileValidatorAdapter } from "@domain/adapters/file-validator";
import { IFile } from "@nestjs/common/pipes/file/interfaces";

export enum MimeTypes {
  PDF = "application/pdf",
  IMAGE = "image/"
}

export class ValidateFileTypeUseCase implements FileValidatorAdapter {
  isValid(file: IFile, types: MimeTypes[]): boolean {
    const normalizedMimeType = file.mimetype.toLowerCase();
    return types.some(
      (type) =>
        type.toLowerCase() === normalizedMimeType ||
        normalizedMimeType.startsWith(type.toLowerCase())
    );
  }

  buildErrorMessage(types: MimeTypes[]): string {
    return `File type is invalid. File types accept are ${types.join(", ")}`;
  }
}
