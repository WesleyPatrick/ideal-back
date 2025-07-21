import { IFile } from "@nestjs/common/pipes/file/interfaces";

export abstract class FileValidatorAdapter {
  abstract isValid(file: IFile, param: unknown): boolean;
  abstract buildErrorMessage(param: unknown): string;
}
