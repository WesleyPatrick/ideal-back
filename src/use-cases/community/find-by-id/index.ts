import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Community } from "@domain/entities/community";
import { CommunityRepository } from "@domain/repositories/community";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCommunityByIdUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(communityId: string): Promise<Community | void> {
    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return this.exception.notFound({
        message: "Not found a community with this id"
      });
    }

    return community;
  }
}
