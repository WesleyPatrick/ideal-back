import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Community } from "@domain/entities/community";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { CommunityRepository } from "@domain/repositories/community";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCommunitiesByServiceProviderIdUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    serviceProviderId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community> | void> {
    const serviceProvider =
      await this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProvider) {
      return this.exception.notFound({
        message: "Not found a service provider with this id"
      });
    }

    return await this.communityRepository.findAllCommunitiesByServiceProviderId(
      serviceProviderId,
      params
    );
  }
}
