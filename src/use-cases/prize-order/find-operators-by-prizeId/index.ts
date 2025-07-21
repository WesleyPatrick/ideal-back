import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  FindOperatorsByPrizeIdResponse,
  PrizeOrderRepository
} from "@domain/repositories/prize-order";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllOperatorsByPrizeIdUseCase {
  constructor(
    private readonly prizeOrderRespository: PrizeOrderRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    prizeId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindOperatorsByPrizeIdResponse> | void> {
    const { page = 1, pageSize = 10 } = params;

    const havePrizeOrderWithThisPrizeId =
      await this.prizeOrderRespository.findByPrizeId(prizeId);

    if (!havePrizeOrderWithThisPrizeId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id in prize order"
      });
    }

    const operators = await this.prizeOrderRespository.findOperatorsByPrizeId(
      prizeId,
      { page, pageSize }
    );

    if (!operators) {
      return this.exceptionAdapter.internalServerError({
        message: "Internal Server Error"
      });
    }

    return operators;
  }
}
