import { RankingResponse, UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RankingUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<RankingResponse[]> {
    return await this.userRepository.ranking();
  }
}
