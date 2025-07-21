import { Injectable } from "@nestjs/common";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { PaginatedEntity } from "@domain/entities/pagination";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  EmployeeRepository,
  FindAllEmployees,
  FindAllEmployeesReturn
} from "@domain/repositories/employee";

@Injectable()
export class FindAllEmployeesPaginatedUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: FindAllEmployees
  ): Promise<PaginatedEntity<FindAllEmployeesReturn> | void> {
    const { serviceProviderId } = params;

    const serviceProvider =
      await this.serviceProviderRepository.findById(serviceProviderId);
    if (!serviceProvider) {
      return this.exceptionsAdapter.badRequest({
        message: "ServiceProvider not found"
      });
    }

    return await this.employeeRepository.findAllPaginated(params);
  }
}
