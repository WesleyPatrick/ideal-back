import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import {
  CreateServiceProviderParams,
  FindAllServiceProviderNoPaginationByOperatorIdResponse,
  FindAllServiceProviderReturn,
  FindAllServiceProviders,
  ServiceProviderRepository,
  UpdateServiceProviderParams
} from "@domain/repositories/service-provider";
import { UserMapper } from "@infra/mappers/users-mapper";
import { UserWithServiceProvider } from "@domain/entities/base-user";
import { PaginatedEntity } from "@domain/entities/pagination";
import { RoleValue } from "@domain/entities/roles";
import { ServiceProvider } from "@domain/entities/service-provider";
import { ServiceProviderMapper } from "@infra/mappers/service-provider-mapper";

@Injectable()
export class PrismaServiceProviderRepository
  implements ServiceProviderRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserWithServiceProvider> {
    const userWithServiceProvider = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        serviceProvider: true
      }
    });

    return UserMapper.toDomainWithServiceProvider(userWithServiceProvider);
  }

  async update(
    serviceProviderId: string,
    params: UpdateServiceProviderParams
  ): Promise<ServiceProvider> {
    const {
      address,
      city,
      cnpj,
      cpf,
      email,
      name,
      password,
      phone,
      responsible,
      state,
      avatar
    } = params;

    const serviceProvider = await this.prisma.serviceProvider.update({
      where: {
        id: serviceProviderId
      },
      data: {
        user: {
          update: {
            name,
            password,
            email,
            cpf,
            address,
            city,
            phone,
            state,
            cnpj,
            responsible,
            avatar
          }
        }
      }
    });

    return ServiceProviderMapper.toDomain(serviceProvider);
  }
  async findById(serviceProviderId: string): Promise<ServiceProvider | null> {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: {
        id: serviceProviderId
      }
    });

    if (!serviceProvider) {
      return null;
    }

    return ServiceProviderMapper.toDomain(serviceProvider);
  }

  async findAllNoPaginationByOperatorId(
    operatorId: string
  ): Promise<FindAllServiceProviderNoPaginationByOperatorIdResponse[]> {
    const servicesProviders = await this.prisma.serviceProvider.findMany({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      },
      where: {
        operatorId
      }
    });

    const serviceProvidersFormatted = servicesProviders.map(
      (servicesProvider) => {
        return {
          id: servicesProvider.id,
          userId: servicesProvider.userId,
          name: servicesProvider.user.name,
          operatorId
        };
      }
    );

    return serviceProvidersFormatted;
  }

  async createServiceProvider(
    params: CreateServiceProviderParams
  ): Promise<string | void> {
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
      avatar,
      operatorId
    } = params;

    const serviceProviderId = await this.prisma.$transaction(async (tx) => {
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

      const serviceProvider = await tx.serviceProvider.create({
        data: {
          userId: baseUser.id,
          operatorId
        }
      });

      return serviceProvider.id;
    });
    return serviceProviderId;
  }

  async findByIdWithUser(id: string): Promise<UserWithServiceProvider | null> {
    const userWithServiceProvider = await this.prisma.user.findFirst({
      where: {
        serviceProvider: {
          id: id
        }
      },
      include: {
        serviceProvider: true
      }
    });

    if (!userWithServiceProvider || !userWithServiceProvider.serviceProvider) {
      return null;
    }

    return UserMapper.toDomainWithServiceProvider(userWithServiceProvider);
  }

  async findAllPaginated(
    params: FindAllServiceProviders
  ): Promise<PaginatedEntity<FindAllServiceProviderReturn>> {
    const { operatorId, name, page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const [serviceProviders, total] = await this.prisma.$transaction([
      this.prisma.serviceProvider.findMany({
        where: {
          operatorId,
          user: {
            role: RoleValue.SERVICE_PROVIDER,
            name: {
              contains: name,
              mode: "insensitive"
            }
          }
        },
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              responsible: true,
              solecas: true
            }
          },
          _count: {
            select: { employees: true }
          }
        }
      }),
      this.prisma.serviceProvider.count({
        where: {
          operatorId,
          user: {
            role: RoleValue.SERVICE_PROVIDER,
            name: {
              contains: name,
              mode: "insensitive"
            }
          }
        }
      })
    ]);

    return {
      data: serviceProviders.map((serviceProvider) => ({
        serviceProviderId: serviceProvider.id,
        name: serviceProvider.user.name,
        avatar: serviceProvider.user.avatar,
        responsible: serviceProvider.user.responsible,
        employees: serviceProvider._count.employees,
        solecas: Number(serviceProvider.user.solecas)
      })),
      total,
      page,
      lastPage: Math.ceil(total / pageSize)
    };
  }
}
