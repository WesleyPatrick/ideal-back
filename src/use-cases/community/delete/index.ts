import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { FileStorageAdapter } from "@domain/adapters/file-storage";
import { CommunityRepository } from "@domain/repositories/community";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCommunityUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(communityId: string): Promise<void> {
    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return this.exceptionAdapter.notFound({
        message: "Not found a community with this id"
      });
    }

    if (community.cover) {
      const deleteCommunityCoverImage = await this.fileStorage.deleteFile(
        community.cover
      );

      if (!deleteCommunityCoverImage) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to delete community cover image"
        });
      }
    }

    const deletedCommunity = await this.communityRepository.delete(communityId);

    if (!deletedCommunity) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to delete a community"
      });
    }
  }
}
