import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { OperatorRepository } from "@domain/repositories/operator";
import {
  FindAllServiceProviderNoPaginationByOperatorIdResponse,
  ServiceProviderRepository
} from "@domain/repositories/service-provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllServicesProvidersNoPaginationByOperatorIdUseCase {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    operatorId: string
  ): Promise<FindAllServiceProviderNoPaginationByOperatorIdResponse[] | void> {
    const haveOperatorWithThisId =
      await this.operatorRepository.findById(operatorId);

    if (!haveOperatorWithThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    return await this.serviceProviderRepository.findAllNoPaginationByOperatorId(
      operatorId
    );
  }
}
