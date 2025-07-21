import { FileStorageAdapter } from "@domain/adapters/file-storage";
import { FileController } from "@infra/controllers/file";
import { S3FileUploadIntegration } from "@infra/integrations/file-storage/s3";
import { Module } from "@nestjs/common";
import { GetFileUseCase } from "@use-cases/file/get-file";
import { S3Module } from "nestjs-s3";
import { env } from "process";
import { ExceptionsModule } from "../exceptions";
import { ValidateFilePathsUseCase } from "@use-cases/file/validate-file-paths";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { GetFilePresignedUrlUseCase } from "@use-cases/file/get-presigned-url";

@Module({
  imports: [
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: env.AWS_S3_BUCKET_ACCESS_KEY,
          secretAccessKey: env.AWS_S3_BUCKET_SECRET_KEY
        },
        region: env.AWS_S3_BUCKET_REGION,
        forcePathStyle: true
      }
    }),
    ExceptionsModule
  ],
  controllers: [FileController],
  providers: [
    {
      useClass: S3FileUploadIntegration,
      provide: FileStorageAdapter
    },
    GetFileUseCase,
    UploadFileUseCase,
    ValidateFilePathsUseCase,
    GetFilePresignedUrlUseCase
  ],
  exports: [
    {
      useClass: S3FileUploadIntegration,
      provide: FileStorageAdapter
    },
    UploadFileUseCase,
    ValidateFilePathsUseCase,
    GetFileUseCase
  ]
})
export class FileModule {}
