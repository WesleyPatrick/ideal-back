import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EmployeeRepository } from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

export interface FindEmployeeProgressUseCaseResponse {
  progress: number;
}

@Injectable()
export class FindEmployeeProgressUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    employeeId: string
  ): Promise<FindEmployeeProgressUseCaseResponse | void> {
    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exception.notFound({
        message: "Not found a employee with this id"
      });
    }

    const { totalActivities, totalActivitiesDone } =
      await this.employeeRepository.getUserProgressData(employee.userId);

    const progress = Math.round((totalActivitiesDone / totalActivities) * 100);

    return {
      progress
    };
  }
}
