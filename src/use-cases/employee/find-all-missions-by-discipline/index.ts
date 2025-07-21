import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity } from "@domain/entities/pagination";
import { DisciplineRepository } from "@domain/repositories/discipline";
import {
  CardResponseWithoutLastAttempt,
  EmployeeRepository,
  FindDisciplineModulesParams
} from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllEmployeeModulesByDisciplineUseCase {
  constructor(
    private readonly disciplieRepository: DisciplineRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: FindDisciplineModulesParams
  ): Promise<PaginatedEntity<CardResponseWithoutLastAttempt> | void> {
    const { disciplineId, employeeId, page, pageSize } = params;

    const discipline = await this.disciplieRepository.findById(disciplineId);

    if (!discipline) {
      return this.exception.notFound({
        message: "Not found a discipline with this id"
      });
    }

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exception.notFound({
        message: "Not found a employee with this id"
      });
    }

    return await this.employeeRepository.findDisciplineModules({
      disciplineId,
      employeeId,
      page,
      pageSize
    });
  }
}
