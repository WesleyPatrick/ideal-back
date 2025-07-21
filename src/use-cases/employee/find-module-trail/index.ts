import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FindModuleTrailResponse,
  EmployeeRepository,
  FindModuleTrailParams
} from "@domain/repositories/employee";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmployeeModuleTrailUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: FindModuleTrailParams
  ): Promise<FindModuleTrailResponse | void> {
    const { moduleId, employeeId } = params;

    const module = await this.moduleRepository.findById(moduleId);

    if (!module) {
      return this.exception.notFound({
        message: "Not found a module with this id"
      });
    }

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exception.notFound({
        message: "Not found a employee with this id"
      });
    }

    return await this.employeeRepository.findModuleTrail({
      moduleId,
      employeeId
    });
  }
}
