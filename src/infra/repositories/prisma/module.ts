import { Module } from "@domain/entities/module";
import { PaginatedParams, PaginatedEntity } from "@domain/entities/pagination";
import {
  CreateModuleParams,
  CreateModuleResponse,
  EditModuleParams,
  FindByIdWithRelationsResponse,
  FindModuleByIndexParams,
  FindModuleByNameParams,
  ModuleRepository
} from "@domain/repositories/module";
import { PrismaService } from "@infra/config/prisma";
import { ModuleMapper } from "@infra/mappers/module-mapper";
import { Injectable } from "@nestjs/common";
import { getRandomColor } from "@use-cases/utils";

@Injectable()
export class PrismaModuleRepository implements ModuleRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByIdWithRelations(
    moduleId: string
  ): Promise<FindByIdWithRelationsResponse | null> {
    const result = await this.prisma.$queryRaw<
      {
        id: string;
        name: string;
        discipline_name: string;
        missions_count: number;
        steps_count: number;
        activities_count: number;
      }[]
    >`
    SELECT 
      m.id,
      m.title AS name,
      d.title AS discipline_name,
      (
        SELECT COUNT(*) 
        FROM missions mi 
        WHERE mi.module_id = m.id
      ) AS missions_count,
      (
        SELECT COUNT(*) 
        FROM steps s 
        INNER JOIN missions mi ON s.mission_id = mi.id
        WHERE mi.module_id = m.id
      ) AS steps_count,
      (
        SELECT 
          COUNT(*) 
        FROM (
          SELECT va.id 
          FROM video_activities va 
          INNER JOIN steps s ON va.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
          UNION ALL
          SELECT da.id FROM dialog_activities da 
          INNER JOIN steps s ON da.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
          UNION ALL
          SELECT mra.id FROM multiple_response_activities mra 
          INNER JOIN steps s ON mra.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
          UNION ALL
          SELECT ia.id FROM image_activities ia 
          INNER JOIN steps s ON ia.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
          UNION ALL
          SELECT csa.id FROM complete_sentence_activities csa 
          INNER JOIN steps s ON csa.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
          UNION ALL
          SELECT tofa.id FROM true_or_false_activities tofa 
          INNER JOIN steps s ON tofa.step_id = s.id
          INNER JOIN missions mi ON s.mission_id = mi.id
          WHERE mi.module_id = m.id
        ) AS all_activities
      ) AS activities_count
    FROM modules m
    INNER JOIN disciplines d ON d.id = m.discipline_id
    WHERE m.id = ${moduleId}
  `;

    if (!result.length) {
      return null;
    }

    const row = result[0];

    return {
      id: row.id,
      moduleName: row.name,
      disciplineName: row.discipline_name,
      missionCount: Number(row.missions_count),
      stepCount: Number(row.steps_count),
      activitiesCount: Number(row.activities_count)
    };
  }

  async findAllByDisciplineId(
    disciplineId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Module>> {
    const { page, pageSize } = params;

    const { total, modules } = await this.prisma.$transaction(async (tx) => {
      const modules = await tx.module.findMany({
        where: {
          disciplineId
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      });

      const total = await tx.module.count({
        where: {
          disciplineId
        }
      });

      return { total, modules };
    });

    return {
      data: modules.map(ModuleMapper.toDomain),
      total,
      page,
      lastPage: Math.ceil(total / pageSize)
    };
  }

  async findAllByDisciplineIdNoPagination(
    disciplineId: string
  ): Promise<Module[]> {
    const modules = await this.prisma.module.findMany({
      where: {
        disciplineId
      }
    });

    return modules.map(ModuleMapper.toDomain);
  }

  async edit(params: EditModuleParams): Promise<Module> {
    const { missions, newModuleTitle, moduleId } = params;

    const { module } = await this.prisma.$transaction(async (tx) => {
      const moduleUpdated = await tx.module.update({
        where: {
          id: moduleId
        },
        data: {
          title: newModuleTitle
        }
      });

      if (missions) {
        for (let i = 0; i < missions.length; i++) {
          await tx.mission.update({
            where: {
              id: missions[i].missionId
            },
            data: {
              title: missions[i].newMissionTitle
            }
          });
        }
      }

      return {
        module: moduleUpdated
      };
    });

    return ModuleMapper.toDomain(module);
  }
  async findByIndex(params: FindModuleByIndexParams): Promise<Module | null> {
    const { disciplineId, index } = params;

    const module = await this.prisma.module.findFirst({
      where: {
        disciplineId,
        index
      }
    });

    if (!module) {
      return null;
    }

    return ModuleMapper.toDomain(module);
  }

  async findByName(params: FindModuleByNameParams): Promise<Module | null> {
    const { disciplineId, moduleTitle } = params;

    const module = await this.prisma.module.findFirst({
      where: {
        disciplineId,
        title: moduleTitle
      }
    });

    if (!module) {
      return null;
    }

    return ModuleMapper.toDomain(module);
  }

  async create(params: CreateModuleParams): Promise<CreateModuleResponse> {
    const { missionsTitles, title, disciplineId, index } = params;

    const { module } = await this.prisma.$transaction(async (tx) => {
      const newModule = await tx.module.create({
        data: {
          title,
          disciplineId,
          index
        }
      });

      for (let i = 0; i < missionsTitles.length; i++) {
        await tx.mission.create({
          data: {
            title: missionsTitles[i],
            index: i,
            moduleId: newModule.id,
            color: getRandomColor()
          }
        });
      }

      return {
        module: newModule
      };
    });

    return {
      module: ModuleMapper.toDomain(module),
      missionsTitles
    };
  }

  async findById(moduleId: string): Promise<Module | null> {
    const module = await this.prisma.module.findUnique({
      where: {
        id: moduleId
      }
    });

    if (!module) {
      return null;
    }

    return ModuleMapper.toDomain(module);
  }

  async delete(moduleId: string): Promise<boolean> {
    const deletedModule = await this.prisma.module.delete({
      where: {
        id: moduleId
      }
    });

    return !!deletedModule;
  }
}
