import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { TokenAdapter } from "@domain/adapters/token";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface LoginUseCaseParams {
  email: string;
  password: string;
}

export type LoginUseCaseReturn = Promise<{ accessToken: string } | void>;

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenAdapter,
    private readonly cryptographyService: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async login({ email, password }: LoginUseCaseParams): LoginUseCaseReturn {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return this.exceptionsAdapter.wrongCredentials();
    }

    const isPasswordValid = await this.cryptographyService.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return this.exceptionsAdapter.wrongCredentials();
    }

    const accessToken = await this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { accessToken };
  }
}
