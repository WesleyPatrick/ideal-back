import { Injectable } from "@nestjs/common";
import {
  FindAllServiceProviderReturn,
  FindAllServiceProviders,
  ServiceProviderRepository
} from "@domain/repositories/service-provider";
import { PaginatedEntity } from "@domain/entities/pagination";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";

@Injectable()
export class FindAllServiceProvidersUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly operatorRepository: OperatorRepository
  ) {}

  async execute(
    params: FindAllServiceProviders
  ): Promise<PaginatedEntity<FindAllServiceProviderReturn> | void> {
    const { operatorId } = params;

    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      return this.exceptionsAdapter.badRequest({
        message: "Operator not found"
      });
    }

    return await this.serviceProviderRepository.findAllPaginated(params);
  }
}
