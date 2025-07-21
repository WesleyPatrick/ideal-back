import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { UserWithEmployee } from "@domain/entities/base-user";
import { EmployeeRepository } from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindEmployeeByIdUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(employeeId: string): Promise<UserWithEmployee | void> {
    const userWithEmployee =
      await this.employeeRepository.findByIdWithUser(employeeId);

    if (!userWithEmployee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee with this id"
      });
    }

    delete userWithEmployee.password;

    return userWithEmployee;
  }
}
