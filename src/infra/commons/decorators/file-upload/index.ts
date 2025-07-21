import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

const storage = memoryStorage();

export const FileUploadDecorator = (files: MulterField[]): MethodDecorator =>
  applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(files, {
        storage
      })
    )
  );
