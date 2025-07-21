import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  FileStorageAdapter,
  FileWithMetadata
} from "@domain/adapters/file-storage";
import { Injectable } from "@nestjs/common";
import { InjectS3, S3 } from "nestjs-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "process";

@Injectable()
export class S3FileUploadIntegration implements FileStorageAdapter {
  constructor(@InjectS3() private readonly s3: S3) {}
  private readonly bucketName = env.AWS_S3_BUCKET_NAME;

  async getFilePresignedUrl(path: string): Promise<string | void> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: path,
        ResponseContentDisposition: "inline"
      });

      const EXPIRE_IN_SECONDS = 604800;

      const url = await getSignedUrl(this.s3, command, {
        expiresIn: EXPIRE_IN_SECONDS
      });

      return url;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string
  ): Promise<string | null> {
    try {
      await this.s3.putObject({
        Bucket: this.bucketName,
        Key: path,
        ContentType: file.mimetype,
        Body: file.buffer
      });

      return path;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getFile(path: string): Promise<FileWithMetadata | null> {
    try {
      const file = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: path
      });

      const data = await file.Body.transformToByteArray();
      const contentType = file.ContentType || "application/octet-stream";

      return {
        data,
        contentType
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: path
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
