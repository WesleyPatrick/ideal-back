import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { User } from "@domain/entities/base-user";
import { RoleValue } from "@domain/entities/roles";
import { EmployeeRepository } from "@domain/repositories/employee";
import { OperatorRepository } from "@domain/repositories/operator";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetUserProfileWithRoleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(user: User): Promise<unknown> {
    const { id, role } = user;

    switch (role) {
      case RoleValue.ADMIN: {
        const admin = await this.userRepository.findById(id);

        delete admin.password;

        return admin;
      }
      case RoleValue.EMPLOYEE: {
        const employee = await this.employeeRepository.findByUserIdWithUser(id);

        delete employee.password;

        return employee;
      }
      case RoleValue.OPERATOR: {
        const operator = await this.operatorRepository.findByUserId(id);

        delete operator.password;

        return operator;
      }
      case RoleValue.SERVICE_PROVIDER: {
        const serviceProvider =
          await this.serviceProviderRepository.findByUserId(id);

        delete serviceProvider.password;

        return serviceProvider;
      }
      default:
        return this.exceptionAdapter.notFound({
          message: "Not found a role"
        });
    }
  }
}
