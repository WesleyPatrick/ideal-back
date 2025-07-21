import { Module } from "@domain/entities/module";
import { Module as PrismaModule } from "@prisma/client";

export class ModuleMapper {
  static toDomain(module: PrismaModule): Module {
    return {
      id: module.id,
      title: module.title,
      index: module.index,
      disciplineId: module.disciplineId,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt
    };
  }

  static toPersistence(module: Module): PrismaModule {
    return {
      id: module.id,
      title: module.title,
      index: module.index,
      disciplineId: module.disciplineId,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt
    };
  }
}
