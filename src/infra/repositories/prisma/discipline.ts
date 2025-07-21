import { Discipline } from "@domain/entities/discipline";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  CreateDisciplineParams,
  CreateDisciplineResponse,
  DisciplineRepository,
  DisciplineWithOperatorId,
  DisciplineWithRelations,
  EditDisciplineParams,
  FindAllByOperatorIdNoPaginationResponse,
  FindAllDisciplineParams
} from "@domain/repositories/discipline";
import { PrismaService } from "@infra/config/prisma";
import { DisciplineMapper } from "@infra/mappers/discipline-mapper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { getRandomColor } from "@use-cases/utils";

@Injectable()
export class PrismaDisciplineRepository implements DisciplineRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAllByOperatorIdNoPagination(
    operatorId: string
  ): Promise<FindAllByOperatorIdNoPaginationResponse[]> {
    const disciplines = await this.prisma.discipline.findMany({
      select: {
        id: true,
        title: true
      },
      where: {
        operators: {
          some: {
            id: operatorId
          }
        }
      }
    });

    return disciplines.map((discipline) => ({
      disciplineId: discipline.id,
      disciplineName: discipline.title
    }));
  }

  async findByOperatorId(
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<Discipline>> {
    const { page, pageSize } = params;

    const where: Prisma.DisciplineWhereInput = {
      operators: {
        some: {
          id: operatorId
        }
      }
    };

    const { total, disciplines } = await this.prisma.$transaction(
      async (tx) => {
        const total = await tx.discipline.count({
          where
        });

        const disciplines = await tx.discipline.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize
        });

        return { total, disciplines };
      }
    );

    return {
      data: disciplines.map(DisciplineMapper.toDomain),
      page,
      total,
      lastPage: Math.ceil(total / pageSize)
    };
  }
  async findAllNoPagination(): Promise<Discipline[]> {
    const disciplines = await this.prisma.discipline.findMany();

    return disciplines.map(DisciplineMapper.toDomain);
  }

  async findByIdWithRelations(
    disciplineId: string
  ): Promise<DisciplineWithRelations | null> {
    const discipline = await this.prisma.discipline.findFirst({
      where: { id: disciplineId },
      select: {
        id: true,
        title: true,
        author: true,
        resume: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        modules: {
          orderBy: {
            index: "asc"
          },
          select: {
            id: true,
            title: true,
            index: true,
            missions: {
              orderBy: {
                index: "asc"
              },
              select: {
                id: true,
                title: true,
                index: true
              }
            }
          }
        }
      }
    });

    if (!discipline) {
      return null;
    }

    return discipline;
  }

  async delete(disciplineId: string): Promise<boolean> {
    const deletedDiscipline = await this.prisma.discipline.delete({
      where: {
        id: disciplineId
      }
    });

    return !!deletedDiscipline;
  }

  async findById(disciplineId: string): Promise<Discipline | null> {
    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId
      }
    });

    if (!discipline) {
      return null;
    }

    return DisciplineMapper.toDomain(discipline);
  }

  async findByIdWithOperatorId(
    disciplineId: string
  ): Promise<DisciplineWithOperatorId | null> {
    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId
      },
      include: {
        operators: {
          select: {
            id: true
          }
        }
      }
    });

    if (!discipline) {
      return null;
    }

    return {
      id: discipline.id,
      title: discipline.title,
      author: discipline.author,
      coverImage: discipline.coverImage,
      resume: discipline.resume,
      color: discipline.color,
      createdAt: discipline.createdAt,
      updatedAt: discipline.updatedAt,
      operatorId: discipline.operators[0].id
    };
  }

  async edit(
    disciplineId: string,
    params: EditDisciplineParams
  ): Promise<Discipline> {
    const { author, coverImage, resume, title } = params;

    const discipline = await this.prisma.discipline.update({
      where: {
        id: disciplineId
      },
      data: {
        author,
        coverImage,
        resume,
        title
      }
    });

    return DisciplineMapper.toDomain(discipline);
  }

  async findByTitle(title: string): Promise<Discipline | null> {
    const discipline = await this.prisma.discipline.findFirst({
      where: {
        title
      }
    });

    if (!discipline) {
      return null;
    }

    return DisciplineMapper.toDomain(discipline);
  }

  async findAll(
    params: FindAllDisciplineParams
  ): Promise<PaginatedEntity<Discipline>> {
    const { page, pageSize, title } = params;

    const where: Prisma.DisciplineWhereInput = {
      AND: [
        title
          ? {
              title: {
                contains: title,
                mode: "insensitive"
              }
            }
          : {}
      ]
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.discipline.count({ where }),
      this.prisma.discipline.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return {
      data: data.map(DisciplineMapper.toDomain),
      page,
      total,
      lastPage: Math.ceil(total / pageSize)
    };
  }

  async create(
    params: CreateDisciplineParams
  ): Promise<CreateDisciplineResponse> {
    const {
      author,
      coverImage,
      missionTitles,
      moduleTitle,
      resume,
      title,
      operatorId,
      color
    } = params;

    const { discipline, module } = await this.prisma.$transaction(
      async (tx) => {
        const newDiscipline = await tx.discipline.create({
          data: {
            title,
            author,
            coverImage,
            resume,
            color,
            operators: {
              connect: {
                id: operatorId
              }
            }
          }
        });

        const newModule = await tx.module.create({
          data: {
            title: moduleTitle,
            disciplineId: newDiscipline.id,
            index: 0
          }
        });

        for (let i = 0; i < missionTitles.length; i++) {
          await tx.mission.create({
            data: {
              title: missionTitles[i],
              moduleId: newModule.id,
              index: i,
              color: getRandomColor()
            }
          });
        }

        return {
          discipline: newDiscipline,
          module: newModule
        };
      }
    );

    return {
      discipline: DisciplineMapper.toDomain(discipline),
      moduleTitle: module.title,
      missionTitles
    };
  }
}
