import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Prize } from "@domain/entities/prize";
import { PrizeRepository } from "@domain/repositories/prize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindPrizeByIdUseCase {
  constructor(
    private readonly prizeRepository: PrizeRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(prizeId: string): Promise<Prize | void> {
    const prize = await this.prizeRepository.findById(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    return prize;
  }
}
