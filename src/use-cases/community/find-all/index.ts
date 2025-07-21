import { Community } from "@domain/entities/community";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  CommunityRepository,
  FindAllWithPagination
} from "@domain/repositories/community";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllCommunitiesUseCase {
  constructor(private readonly communityRepository: CommunityRepository) {}

  async execute(
    params: FindAllWithPagination
  ): Promise<PaginatedEntity<Community>> {
    const { page, pageSize, name } = params;

    return await this.communityRepository.findAll({
      name,
      page,
      pageSize
    });
  }
}
