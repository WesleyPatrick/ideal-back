import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { Prize } from "@domain/entities/prize";
import { PrizeRepository } from "@domain/repositories/prize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllPrizesUseCase {
  constructor(private readonly prizeRepository: PrizeRepository) {}

  async execute(params: PaginatedParams): Promise<PaginatedEntity<Prize>> {
    const { page = 1, pageSize = 10 } = params;

    return await this.prizeRepository.findAll({
      page,
      pageSize
    });
  }
}
