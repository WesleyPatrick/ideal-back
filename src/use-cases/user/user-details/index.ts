import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { RoleValue } from "@domain/entities/roles";
import { UserDetailsResponse, UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindUserDetailsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(userId: string): Promise<UserDetailsResponse | void> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.role !== RoleValue.EMPLOYEE) {
      return this.exception.notFound({
        message: "Not found a employee with this id"
      });
    }

    return await this.userRepository.userDetails(userId);
  }
}
