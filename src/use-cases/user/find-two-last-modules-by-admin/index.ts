import { CardModuleResponse, UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindTwoLastModulesByAdminUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<CardModuleResponse[]> {
    return await this.userRepository.findTwoLastModules();
  }
}
