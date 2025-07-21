import { Community } from "@domain/entities/community";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Injectable } from "@nestjs/common";

export interface CreateCommunityParams {
  name: string;
  author: string;
  resume: string;
  cover: string;
  operatorId: string;
  profileId: string;
}

export interface UpdateCommunityParams {
  name?: string;
  author?: string;
  resume?: string;
  cover?: string;
}

export interface FindAllWithPagination extends PaginatedParams {
  name?: string;
}

@Injectable()
export abstract class CommunityRepository {
  abstract create(params: CreateCommunityParams): Promise<Community>;
  abstract findById(communityId: string): Promise<Community | null>;
  abstract findByOperatorId(operatorId: string): Promise<Community | null>;
  abstract findAll(
    params: FindAllWithPagination
  ): Promise<PaginatedEntity<Community>>;
  abstract update(
    communityId: string,
    params: UpdateCommunityParams
  ): Promise<Community>;
  abstract delete(communityId: string): Promise<boolean>;
  abstract findAllCommunitiesByOperatorId(
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community>>;
  abstract findAllCommunitiesByServiceProviderId(
    serviceProviderId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community>>;
}
