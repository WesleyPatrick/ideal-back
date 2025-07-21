import { RoleValue } from "@domain/entities/roles";
import { AUTH_DECORATOR_ROLES_METADATA_KEY } from "@infra/commons/decorators/role";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleValidatorUseCase } from "@use-cases/authentication/roles-validator";
import { AuthenticatedRequest } from "@use-cases/authentication/route-authentication";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleValidatorUseCase: RoleValidatorUseCase
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleValue[]>(
      AUTH_DECORATOR_ROLES_METADATA_KEY,
      context.getHandler()
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      return false;
    }

    return this.roleValidatorUseCase.validate(roles, request.user);
  }
}
