import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  FindEmployeesByPrizeIdParam,
  FindEmployeesByPrizeIdResponse,
  PrizeOrderRepository
} from "@domain/repositories/prize-order";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase {
  constructor(
    private readonly prizeOrderRespository: PrizeOrderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    param: FindEmployeesByPrizeIdParam
  ): Promise<PaginatedEntity<FindEmployeesByPrizeIdResponse> | void> {
    const {
      operatorId,
      prizeId,
      serviceProviderId,
      page = 1,
      pageSize = 10
    } = param;

    const prize = await this.prizeOrderRespository.findByPrizeId(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    const operator =
      await this.prizeOrderRespository.findByOperatorId(operatorId);

    if (!operator) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    const serviceProvider =
      await this.prizeOrderRespository.findByServiceProviderId(
        serviceProviderId
      );

    if (!serviceProvider) {
      return this.exceptionAdapter.notFound({
        message: "Not found a service provider with this id"
      });
    }

    return await this.prizeOrderRespository.findAllEmployeesByServiceProviderId(
      {
        operatorId,
        prizeId,
        serviceProviderId,
        page,
        pageSize
      }
    );
  }
}
