import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  FindAllPrizeOrderResponse,
  PrizeOrderRepository
} from "@domain/repositories/prize-order";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllPrizeOrderUseCase {
  constructor(
    private readonly prizeOrderRepository: PrizeOrderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllPrizeOrderResponse> | void> {
    const { page = 1, pageSize = 10 } = params;

    const result = await this.prizeOrderRepository.findAll({
      page,
      pageSize
    });

    if (!result) {
      return this.exceptionAdapter.internalServerError({
        message: "Internal Server Error"
      });
    }

    return result;
  }
}
