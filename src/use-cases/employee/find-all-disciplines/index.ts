import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  EmployeeRepository,
  FindAllDisciplineByEmployeeIdResponse
} from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllDisciplinesByEmployeeIdUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    employeeId: string
  ): Promise<FindAllDisciplineByEmployeeIdResponse[] | void> {
    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee with this id"
      });
    }

    return await this.employeeRepository.findAllDisciplineByEmployeeId(
      employeeId
    );
  }
}
