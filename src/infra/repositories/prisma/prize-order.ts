import { Injectable } from "@nestjs/common";
import {
  CreatePrizeOrderParams,
  FindOperatorsByPrizeIdResponse,
  FindAllPrizeOrderResponse,
  PrizeOrderRepository,
  FindServicesProvidersByPrizeIdResponse,
  FindEmployeesByPrizeIdParam,
  FindEmployeesByPrizeIdResponse
} from "@domain/repositories/prize-order";
import { PrizeOrder } from "@domain/entities/prize-order";
import { PrismaService } from "@infra/config/prisma";
import { PrizeOrderMapper } from "@infra/mappers/prize-order-mapper";
import { PaginatedParams, PaginatedEntity } from "@domain/entities/pagination";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaPrizeOrderRepository implements PrizeOrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByServiceProviderId(
    serviceProviderId: string
  ): Promise<PrizeOrder | null> {
    const prizeOrder = await this.prisma.prizeOrder.findFirst({
      where: {
        serviceProviderId
      }
    });

    if (!prizeOrder) {
      return null;
    }

    return PrizeOrderMapper.toDomain(prizeOrder);
  }

  async findAllEmployeesByServiceProviderId(
    params: FindEmployeesByPrizeIdParam
  ): Promise<PaginatedEntity<FindEmployeesByPrizeIdResponse>> {
    const { operatorId, prizeId, serviceProviderId, page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    const { employees, solecasUsedByEmployee, total } =
      await this.prisma.$transaction(async (tx) => {
        const employees = await tx.prizeOrder.findMany({
          select: {
            solecasValue: true,
            employee: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    avatar: true,
                    solecas: true
                  }
                }
              }
            }
          },
          where: {
            prizeId,
            operatorId,
            serviceProviderId
          },
          distinct: ["employeeId"],
          skip: offset,
          take: pageSize
        });

        const solecasUsedByEmployee = await tx.prizeOrder.groupBy({
          by: ["employeeId"],
          where: {
            prizeId,
            operatorId,
            serviceProviderId
          },
          _sum: {
            solecasValue: true
          }
        });

        const [{ total }] = await tx.$queryRaw<{ total: number }[]>(Prisma.sql`
          SELECT COUNT(DISTINCT "employee_id") as total
          FROM "prize_orders"
          WHERE "prize_id" = ${prizeId} 
            AND "operator_id" = ${operatorId} 
            AND "service_provider_id" = ${serviceProviderId}
        `);

        return {
          employees,
          solecasUsedByEmployee,
          total: Number(total)
        };
      });

    return {
      data: employees.map((data) => {
        return {
          id: data.employee.id,
          name: data.employee.user.name,
          avatar: data.employee.user.avatar,
          currentSolecas: Number(data.employee.user.solecas),
          solecasUsed:
            solecasUsedByEmployee.find((s) => s.employeeId === data.employee.id)
              ?._sum.solecasValue ?? 0
        };
      }),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async findByOperatorId(operatorId: string): Promise<PrizeOrder | null> {
    const prizeOrder = await this.prisma.prizeOrder.findFirst({
      where: {
        operatorId
      }
    });

    if (!prizeOrder) {
      return null;
    }

    return PrizeOrderMapper.toDomain(prizeOrder);
  }

  async findServicesProvidersByPrizeIdAndOperatorId(
    prizeId: string,
    operatorId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindServicesProvidersByPrizeIdResponse>> {
    const { page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    const { servicesProviders, total } = await this.prisma.$transaction(
      async (tx) => {
        const servicesProviders = await tx.prizeOrder.findMany({
          select: {
            serviceProvider: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    avatar: true,
                    responsible: true
                  }
                }
              }
            }
          },
          where: {
            prizeId,
            operatorId
          },
          distinct: ["serviceProviderId"],
          skip: offset,
          take: pageSize
        });

        const [{ total }] = await tx.$queryRaw<{ total: number }[]>(Prisma.sql`
          SELECT COUNT(DISTINCT "service_provider_id") as total
          FROM "prize_orders"
          WHERE "prize_id" = ${prizeId} AND "operator_id" = ${operatorId}
        `);

        return {
          servicesProviders,
          total: Number(total)
        };
      }
    );

    return {
      data: servicesProviders.map((serviceProvider) => {
        return {
          id: serviceProvider.serviceProvider.id,
          name: serviceProvider.serviceProvider.user.name,
          avatar: serviceProvider.serviceProvider.user.avatar,
          responsible: serviceProvider.serviceProvider.user.responsible
        };
      }),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async findByPrizeId(prizeId: string): Promise<PrizeOrder | null> {
    const prizeOrder = await this.prisma.prizeOrder.findFirst({
      where: {
        prizeId
      }
    });

    if (!prizeOrder) return null;

    return PrizeOrderMapper.toDomain(prizeOrder);
  }

  async findOperatorsByPrizeId(
    prizeId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindOperatorsByPrizeIdResponse>> {
    const { page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    const operators = await this.prisma.$queryRaw<
      FindOperatorsByPrizeIdResponse[]
    >(Prisma.sql`
      SELECT DISTINCT
        o.id,
        u.name,
        u.avatar
      FROM prize_orders po
      JOIN operators o ON o.id = po.operator_id
      JOIN users u ON u.id = o.user_id
      WHERE po.prize_id = ${prizeId}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `);

    const totalResult = await this.prisma.$queryRaw<
      {
        count: bigint;
      }[]
    >(Prisma.sql`
      SELECT COUNT(DISTINCT o.id) AS count
      FROM prize_orders po
      JOIN operators o ON o.id = po.operator_id
      WHERE po.prize_id = ${prizeId}  
    `);

    const total = Number(totalResult[0]?.count || 0);
    const lastPage = Math.ceil(total / pageSize);

    return {
      data: operators,
      page,
      total,
      lastPage
    };
  }

  async findAll(
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllPrizeOrderResponse>> {
    const { page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    const dataRaw = await this.prisma.$queryRaw<
      FindAllPrizeOrderResponse[]
    >(Prisma.sql`
    SELECT
      p.id,
      p.name,
      p.solecas_value AS "solecasValue",
      p.money_value AS "moneyValue",
      p.description,
      p.image,
      p.color,
      p.expiry_date AS "expiryDate",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt",
      COUNT(po.id) AS "soldCount",
      SUM(po.money_value) AS "totalMoneyValue",
      SUM(po.solecas_value) AS "totalSolecasUsed"
    FROM prizes p
    JOIN prize_orders po ON po.prize_id = p.id
    GROUP BY p.id
    ORDER BY "soldCount" DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `);

    const data: FindAllPrizeOrderResponse[] = dataRaw.map((item) => ({
      id: item.id,
      name: item.name,
      solecasValue: Number(item.solecasValue),
      moneyValue: Number(item.moneyValue),
      description: item.description,
      image: item.image,
      color: item.color,
      expiryDate: item.expiryDate,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      soldCount: Number(item.soldCount),
      totalMoneyValue: Number(item.totalMoneyValue),
      totalSolecasUsed: Number(item.totalSolecasUsed)
    }));

    const totalResult = await this.prisma.$queryRaw<
      { count: bigint }[]
    >(Prisma.sql`
    SELECT COUNT(DISTINCT p.id) AS count
    FROM prizes p
    JOIN prize_orders po ON po.prize_id = p.id
  `);
    const total = Number(totalResult[0]?.count || 0);
    const lastPage = Math.ceil(total / pageSize);

    return {
      data,
      page,
      total,
      lastPage
    };
  }

  async create(params: CreatePrizeOrderParams): Promise<PrizeOrder> {
    const {
      prizeId,
      employeeId,
      serviceProviderId,
      operatorId,
      solecasValue,
      moneyValue,
      solecasRemaining
    } = params;

    const prizeOrder = await this.prisma.prizeOrder.create({
      data: {
        prizeId,
        employeeId,
        serviceProviderId,
        operatorId,
        solecasValue,
        moneyValue,
        solecasRemaining
      }
    });

    return PrizeOrderMapper.toDomain(prizeOrder);
  }
}
