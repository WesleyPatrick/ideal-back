import { ServiceProvider } from "@domain/entities/service-provider";
import { ServiceProvider as PrismaServiceProvider } from "@prisma/client";

export class ServiceProviderMapper {
  static toDomain(serviceProvider: PrismaServiceProvider): ServiceProvider {
    return {
      id: serviceProvider.id,
      userId: serviceProvider.userId,
      operatorId: serviceProvider.operatorId,
      createdAt: serviceProvider.createdAt,
      updatedAt: serviceProvider.updatedAt
    };
  }
}
