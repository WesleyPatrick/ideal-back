import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  EmployeeRepository,
  FindAllEmployeeNoPaginationByServiceProviderIdResponse
} from "@domain/repositories/employee";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllEmployeesByServiceProviderIdNoPaginationUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    serviceProviderId: string
  ): Promise<FindAllEmployeeNoPaginationByServiceProviderIdResponse[] | void> {
    const haveServiceProviderWithThisId =
      await this.serviceProviderRepository.findById(serviceProviderId);

    if (!haveServiceProviderWithThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a service provider with this id"
      });
    }

    return await this.employeeRepository.findAllEmployeeNoPaginationByServiceProviderId(
      serviceProviderId
    );
  }
}
