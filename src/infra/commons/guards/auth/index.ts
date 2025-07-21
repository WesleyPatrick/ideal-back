import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import {
  AuthenticatedRequest,
  RouteAuthenticationUseCase
} from "@use-cases/authentication/route-authentication";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly routeAuthenticationUseCase: RouteAuthenticationUseCase
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return this.routeAuthenticationUseCase.validate(request);
  }
}
