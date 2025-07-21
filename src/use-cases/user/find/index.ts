import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { UserRepository } from "@domain/repositories/user";
import { User } from "@domain/entities/base-user";

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: string): Promise<User | void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionsAdapter.notFound({
        message: `User with ID ${userId} not found`
      });
    }

    delete user.password;

    return user;
  }
}
