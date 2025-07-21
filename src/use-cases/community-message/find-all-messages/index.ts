import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { CommunityRepository } from "@domain/repositories/community";
import {
  CommunityMessageRepository,
  CommunityMessageResponse
} from "@domain/repositories/community-message";
import { Injectable } from "@nestjs/common";

export interface FindAllCommunityMessagesUseCaseParams extends PaginatedParams {
  communityId: string;
}

@Injectable()
export class FindAllCommunityMessagesUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly communityMessageRepository: CommunityMessageRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: FindAllCommunityMessagesUseCaseParams
  ): Promise<PaginatedEntity<CommunityMessageResponse> | void> {
    const { communityId, page, pageSize } = params;

    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return this.exceptionAdapter.notFound({
        message: "Not found a community with this id"
      });
    }

    return await this.communityMessageRepository.findAllMessages({
      communityId,
      page,
      pageSize
    });
  }
}
