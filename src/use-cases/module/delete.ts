import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ModuleRepository } from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(moduleId: string): Promise<void> {
    const haveModuleWithThisId = await this.moduleRepository.findById(moduleId);

    if (!haveModuleWithThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not Found a module with this id"
      });
    }

    await this.moduleRepository.delete(moduleId);
  }
}
