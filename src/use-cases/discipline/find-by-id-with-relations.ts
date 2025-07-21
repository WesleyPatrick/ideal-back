import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  DisciplineRepository,
  DisciplineWithRelations
} from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDisciplineByIdWithRelations {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(disciplineId: string): Promise<DisciplineWithRelations | void> {
    const discipline =
      await this.disciplineRepository.findByIdWithRelations(disciplineId);

    if (!discipline) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this relations"
      });
    }

    return discipline;
  }
}
