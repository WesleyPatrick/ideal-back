export enum StorageFolderPaths {
  AVATAR = "avatar",
  DISCIPLINE_COVER = "discipline-cover",
  COMMUNITY_COVER = "community-cover",
  PRIZE_COVER = "prize-cover",
  IMAGE_ACTIVITY = "image-activity",
  ACTIVITY_INSTRUCTION = "activity_instruction"
}

export interface FileWithMetadata {
  data: Uint8Array;
  contentType: string;
}

export abstract class FileStorageAdapter {
  abstract uploadFile(
    file: Express.Multer.File,
    path: string
  ): Promise<string | null>;
  abstract getFile(path: string): Promise<FileWithMetadata | null>;
  abstract deleteFile(path: string): Promise<boolean>;
  abstract getFilePresignedUrl(path: string): Promise<string | void>;
}
