import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import {
  FindAllNoPaginationResponse,
  FindAllOperatorsReturn,
  FindOperatorByIdReturn,
  OperatorRepository,
  UpdateOperatorParams
} from "@domain/repositories/operator";
import { CreateUserParams } from "@domain/repositories/user";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { User, UserWithOperator } from "@domain/entities/base-user";
import { Operator } from "@domain/entities/operator";
import { OperatorMapper } from "@infra/mappers/operator-mapper";
import { UserMapper } from "@infra/mappers/users-mapper";

@Injectable()
export class PrismaOperatorRepository implements OperatorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserWithOperator> {
    const userWithOperator = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        operator: true
      }
    });

    return UserMapper.toDomainWithOperator(userWithOperator);
  }

  async findByIdAndReturnOperator(
    operatorId: string
  ): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: {
        id: operatorId
      }
    });

    if (!operator) {
      return null;
    }

    return OperatorMapper.toDomain(operator);
  }

  async findAllNoPagination(): Promise<FindAllNoPaginationResponse[]> {
    const operators = await this.prisma.operator.findMany({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return operators.map((operator) => {
      return {
        id: operator.id,
        userId: operator.userId,
        name: operator.user.name
      };
    });
  }

  async createOperator(params: CreateUserParams): Promise<void> {
    const {
      name,
      cpf,
      email,
      phone,
      password,
      role,
      state,
      city,
      address,
      cnpj,
      responsible,
      avatar
    } = params;

    await this.prisma.$transaction(async (tx) => {
      const baseUser = await tx.user.create({
        data: {
          name,
          cpf,
          email,
          phone,
          password,
          role,
          state,
          city,
          address,
          cnpj: cnpj ?? null,
          responsible: responsible ?? null,
          avatar: avatar ?? null
        }
      });

      await tx.operator.create({
        data: {
          userId: baseUser.id
        }
      });
    });
  }

  async findById(id: string): Promise<FindOperatorByIdReturn | null> {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            state: true,
            city: true,
            cnpj: true,
            responsible: true,
            avatar: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!operator || !operator.user) return null;

    const [serviceProvidersCount, employeesCount] =
      await this.prisma.$transaction([
        this.prisma.serviceProvider.count({ where: { operatorId: id } }),
        this.prisma.employee.count({
          where: {
            serviceProvider: {
              operatorId: id
            }
          }
        })
      ]);

    return {
      id: operator.id,
      name: operator.user.name,
      email: operator.user.email,
      phone: operator.user.phone,
      address: operator.user.address,
      state: operator.user.state,
      city: operator.user.city,
      cnpj: operator.user.cnpj,
      responsible: operator.user.responsible,
      avatar: operator.user.avatar,
      createdAt: operator.user.createdAt,
      updatedAt: operator.user.updatedAt,
      serviceProvidersCount,
      formation: 7,
      employeesCount
    };
  }

  async findAll(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllOperatorsReturn>> {
    const { page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const [operators, total] = await this.prisma.$transaction([
      this.prisma.operator.findMany({
        skip: skip > 0 ? skip : undefined,
        take: pageSize > 0 ? pageSize : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              responsible: true,
              avatar: true
            }
          },
          _count: {
            select: {
              serviceProviders: true
            }
          }
        }
      }),
      this.prisma.operator.count()
    ]);

    const operatorIds = operators.map((op) => op.id);

    const serviceProvidersCounts = await this.prisma.serviceProvider.groupBy({
      by: ["operatorId"],
      where: { operatorId: { in: operatorIds } },
      _count: { id: true }
    });

    const serviceProviderIds = await this.prisma.serviceProvider.findMany({
      where: { operatorId: { in: operatorIds } },
      select: { id: true }
    });

    const serviceProviderIdList = serviceProviderIds.map((sp) => sp.id);

    const employeesCounts = await this.prisma.employee.groupBy({
      by: ["serviceProviderId"],
      where: { serviceProviderId: { in: serviceProviderIdList } },
      _count: { id: true }
    });

    const serviceProviderMap = new Map(
      serviceProvidersCounts.map((sp) => [sp.operatorId, sp._count.id])
    );

    const employeeMap = new Map(
      employeesCounts.map((emp) => [emp.serviceProviderId, emp._count.id])
    );

    return {
      data: operators.map((operator) => {
        const serviceProvidersCount = serviceProviderMap.get(operator.id) || 0;

        const employeesCount = serviceProviderIds.reduce(
          (sum, sp) => sum + (employeeMap.get(sp.id) || 0),
          0
        );

        return {
          id: operator.id,
          name: operator.user.name,
          responsible: operator.user.responsible,
          avatar: operator.user.avatar,
          serviceProvidersCount,
          employeesCount
        };
      }),
      total,
      page,
      lastPage: Math.ceil(total / pageSize)
    };
  }

  async updateOperator(params: UpdateOperatorParams): Promise<User> {
    const { operatorId, ...updateData } = params;

    const updatedOperator = await this.prisma.operator.update({
      where: { id: operatorId },
      data: {
        user: { update: { ...updateData } }
      },
      include: { user: true }
    });

    const user = updatedOperator.user;

    return UserMapper.toDomain(user);
  }
}
