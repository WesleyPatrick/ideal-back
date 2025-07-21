import { Injectable } from "@nestjs/common";
import {
  FindAllOperatorsReturn,
  OperatorRepository
} from "@domain/repositories/operator";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";

@Injectable()
export class FindAllOperatorsUseCase {
  constructor(private readonly operatorRepository: OperatorRepository) {}

  async execute(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllOperatorsReturn>> {
    const { page = 1, pageSize = 10 } = params;

    return await this.operatorRepository.findAll({
      page,
      pageSize
    });
  }
}
