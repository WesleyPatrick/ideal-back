import { RoleValue } from "@domain/entities/roles";
import { RoleGuard } from "@infra/commons/guards/role";
import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleValidatorUseCase } from "@use-cases/authentication/roles-validator";

export const AUTH_DECORATOR_ROLES_METADATA_KEY = "ROLES";

export const RoleDecorator = (roles: RoleValue[]): MethodDecorator =>
  applyDecorators(
    SetMetadata(AUTH_DECORATOR_ROLES_METADATA_KEY, roles),
    UseGuards(new RoleGuard(new Reflector(), new RoleValidatorUseCase()))
  );
