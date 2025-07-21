import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { Community } from "@domain/entities/community";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { CommunityRepository } from "@domain/repositories/community";
import { OperatorRepository } from "@domain/repositories/operator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCommunitiesByOperatorIdUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Community> | void> {
    const operator = await this.operatorRepository.findById(operatorId);

    if (!operator) {
      return this.exception.notFound({
        message: "Not found a operator with this id"
      });
    }

    return await this.communityRepository.findAllCommunitiesByOperatorId(
      operatorId,
      params
    );
  }
}
