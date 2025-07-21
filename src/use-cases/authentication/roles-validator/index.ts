import { Injectable } from "@nestjs/common";
import { RoleValue } from "@domain/entities/roles";

@Injectable()
export class RoleValidatorUseCase {
  validate(roles: RoleValue[], user?: { role: RoleValue }): boolean {
    if (!user) return false;

    return roles.includes(user.role);
  }
}
