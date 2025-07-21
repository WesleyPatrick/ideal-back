import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { User } from "@domain/entities/base-user";
import { RoleValue } from "@domain/entities/roles";
import { EmployeeRepository } from "@domain/repositories/employee";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface AddEmployeeSolecasUseCaseParams {
  userParam: User;
  employeeId: string;
  solecasToAdd: number;
}

export interface AddEmployeeSolecasUseCaseResponse {
  solecasValueUpdated: number;
}

@Injectable()
export class AddEmployeeSolecasUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute({
    employeeId,
    solecasToAdd,
    userParam
  }: AddEmployeeSolecasUseCaseParams): Promise<AddEmployeeSolecasUseCaseResponse | void> {
    const userWithEmployee =
      await this.employeeRepository.findByIdWithUser(employeeId);

    if (!userWithEmployee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee user with this id"
      });
    }

    if (
      userParam.role === RoleValue.EMPLOYEE &&
      userParam.id !== userWithEmployee.id
    ) {
      return this.exceptionAdapter.badRequest({
        message: "An employee can only update himself"
      });
    }

    const newSolecasValue = userWithEmployee.solecas + solecasToAdd;

    if (newSolecasValue < 0) {
      return this.exceptionAdapter.badRequest({
        message: "Invalid solecas number"
      });
    }

    const solecasValueUpdated = await this.userRepository.updatedSolecas(
      userWithEmployee.id,
      newSolecasValue
    );

    if (!solecasValueUpdated) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to update solecas"
      });
    }

    return {
      solecasValueUpdated
    };
  }
}
