import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  EmployeeRepository,
  CardResponse
} from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindThreeLastModulesEmployeeUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(employeeId: string): Promise<CardResponse[] | void> {
    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exception.notFound({
        message: "Not found a employee with this id"
      });
    }

    return await this.employeeRepository.findThreeLastModules(employeeId);
  }
}
