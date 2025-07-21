import { Employee } from "@domain/entities/employee";
import { Employee as PrismaEmployee } from "@prisma/client";

export class EmployeeMapper {
  static toDomain(employee: PrismaEmployee): Employee {
    return {
      id: employee.id,
      userId: employee.userId,
      serviceProviderId: employee.serviceProviderId,
      profileId: employee.profileId,
      communityId: employee.communityId,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };
  }
}
