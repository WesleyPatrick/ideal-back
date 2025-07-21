import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { CardModuleResponse, UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindTwoLastModulesByServiceProviderIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    serviceProviderId: string
  ): Promise<CardModuleResponse[] | void> {
    const serviceProvider =
      await this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProvider) {
      return this.exception.notFound({
        message: "Not found a service provider with this id"
      });
    }

    return await this.userRepository.findTwoLastModulesByServiceProviderId(
      serviceProviderId
    );
  }
}
