import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  CreateModuleParams,
  CreateModuleResponse,
  ModuleRepository
} from "@domain/repositories/module";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: CreateModuleParams
  ): Promise<CreateModuleResponse | void> {
    const { disciplineId, index, missionsTitles, title } = params;

    const titleAlreadyUsed = await this.moduleRepository.findByName({
      disciplineId,
      moduleTitle: title
    });

    if (titleAlreadyUsed) {
      return this.exceptionAdapter.badRequest({
        message: "Title alredy used in this discipline"
      });
    }

    const haveThisIndex = await this.moduleRepository.findByIndex({
      disciplineId,
      index
    });

    if (haveThisIndex) {
      return this.exceptionAdapter.badRequest({
        message: "This index module already used in this discipline"
      });
    }

    return await this.moduleRepository.create({
      disciplineId,
      index,
      missionsTitles,
      title
    });
  }
}
