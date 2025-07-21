import { RoleValue } from "@domain/entities/roles";
import { applyDecorators } from "@nestjs/common";
import { AuthDecorator } from "../auth";
import { RoleDecorator } from "../role";

export const AuthWithRoleDecorator = (roles: RoleValue[]): MethodDecorator =>
  applyDecorators(AuthDecorator(), RoleDecorator(roles));
