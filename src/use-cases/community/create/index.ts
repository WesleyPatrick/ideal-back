import { CommunityEmployeeAssociationAdapter } from "@domain/adapters/assign-employee-to-community";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { StorageFolderPaths } from "@domain/adapters/file-storage";
import { Community } from "@domain/entities/community";
import {
  CommunityRepository,
  CreateCommunityParams
} from "@domain/repositories/community";
import { OperatorRepository } from "@domain/repositories/operator";
import { ProfileRepository } from "@domain/repositories/profile";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export type CreateCommunityUseCaseParams = Omit<CreateCommunityParams, "cover">;

@Injectable()
export class CreateCommunityUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly operatorRepository: OperatorRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly communityEmployeeAssociationAdapter: CommunityEmployeeAssociationAdapter
  ) {}

  async execute(
    params: CreateCommunityUseCaseParams,
    communityCover?: Express.Multer.File
  ): Promise<Community | void> {
    const { author, name, operatorId, resume, profileId } = params;

    const operator = await this.operatorRepository.findById(operatorId);

    if (!operator) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      return this.exceptionAdapter.notFound({
        message: "Not found a profile with this id"
      });
    }

    const communityCoverPath = await this.uploadFileUseCase.upload(
      communityCover,
      StorageFolderPaths.COMMUNITY_COVER
    );

    if (!communityCoverPath) {
      return this.exceptionAdapter.notFound({
        message: "Error to upload community cover"
      });
    }

    const community = await this.communityRepository.create({
      author,
      cover: communityCoverPath,
      name,
      operatorId,
      resume,
      profileId
    });

    if (!community) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to create a community"
      });
    }

    await this.communityEmployeeAssociationAdapter.assignEmployeesToCommunity({
      communityId: community.id,
      profileId
    });

    return community;
  }
}
