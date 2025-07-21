import { Injectable } from "@nestjs/common";
import { TokenAdapter } from "@domain/adapters/token";
import { RoleValue } from "@domain/entities/roles";
import { UserRepository } from "@domain/repositories/user";

export interface AuthenticatedRequest extends Omit<Request, "headers"> {
  user?: {
    id: string;
    email: string;
    role: RoleValue;
  };
  headers: {
    authorization?: string;
  };
}

@Injectable()
export class RouteAuthenticationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenAdapter: TokenAdapter
  ) {}

  public async validate(request: AuthenticatedRequest): Promise<boolean> {
    const bearerToken = request?.headers?.authorization;

    if (!bearerToken) {
      console.error("Authorization header is missing.");
      return false;
    }

    const token = bearerToken.split(" ")[1];

    const tokenPayload = await this.tokenAdapter.getPayloadFromToken(token);

    if (!tokenPayload || !tokenPayload.id) {
      console.error("Invalid or expired token.");
      return false;
    }

    const user = await this.userRepository.findById(tokenPayload.id);

    if (!user) {
      console.error("User not found for the provided token.");
      return false;
    }

    request.user = user;

    return true;
  }
}
