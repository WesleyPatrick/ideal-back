import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Community } from "@domain/entities/community";
import { CommunityRepository } from "@domain/repositories/community";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdateCommunityUseCaseParams {
  name?: string;
  author?: string;
  resume?: string;
}

@Injectable()
export class UpdateCommunityUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    communityId: string,
    params: UpdateCommunityUseCaseParams,
    newCoverImage?: Express.Multer.File
  ): Promise<Community | void> {
    const { author, name, resume } = params;

    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return this.exceptionAdapter.notFound({
        message: "Not found a community with this id"
      });
    }

    let newCoverImagePath = null;

    if (newCoverImage) {
      if (community.cover) {
        const deleteActualCoverImage = await this.fileStorage.deleteFile(
          community.cover
        );

        if (!deleteActualCoverImage) {
          return this.exceptionAdapter.internalServerError({
            message: "Error to delete actual cover image"
          });
        }
      }

      newCoverImagePath = await this.uploadFileUseCase.upload(
        newCoverImage,
        StorageFolderPaths.COMMUNITY_COVER
      );

      if (!newCoverImagePath) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to update new cover image"
        });
      }
    }

    return await this.communityRepository.update(communityId, {
      author,
      cover: newCoverImagePath,
      name,
      resume
    });
  }
}
