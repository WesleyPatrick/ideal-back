import {
  FindAllNoPaginationResponse,
  OperatorRepository
} from "@domain/repositories/operator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllOperatorsNoPaginationUseCase {
  constructor(private readonly operatorRepository: OperatorRepository) {}

  async execute(): Promise<FindAllNoPaginationResponse[]> {
    return await this.operatorRepository.findAllNoPagination();
  }
}
