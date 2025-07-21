import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { UserWithServiceProvider } from "@domain/entities/base-user";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindServiceProviderByIdUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    serviceProviderId: string
  ): Promise<UserWithServiceProvider | void> {
    const userWithServiceProvider =
      await this.serviceProviderRepository.findByIdWithUser(serviceProviderId);

    if (!userWithServiceProvider) {
      return this.exceptionAdapter.notFound({
        message: "Not found a service provider with this id"
      });
    }

    delete userWithServiceProvider.password;

    return userWithServiceProvider;
  }
}
