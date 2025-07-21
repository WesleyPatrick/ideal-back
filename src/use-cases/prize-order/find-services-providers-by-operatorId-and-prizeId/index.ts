import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  FindServicesProvidersByPrizeIdResponse,
  PrizeOrderRepository
} from "@domain/repositories/prize-order";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindServicesProvidersByPrizeIdAndOperatorIdUseCase {
  constructor(
    private readonly prizeOrderRepository: PrizeOrderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    prizeId: string,
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindServicesProvidersByPrizeIdResponse> | void> {
    const { page = 1, pageSize = 10 } = params;

    const prize = await this.prizeOrderRepository.findByPrizeId(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    const operator =
      await this.prizeOrderRepository.findByOperatorId(operatorId);

    if (!operator) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    return await this.prizeOrderRepository.findServicesProvidersByPrizeIdAndOperatorId(
      prizeId,
      operatorId,
      {
        page,
        pageSize
      }
    );
  }
}
