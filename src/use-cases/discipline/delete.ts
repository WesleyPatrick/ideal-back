import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { FileStorageAdapter } from "@domain/adapters/file-storage";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteDisciplineUseCase {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(disciplineId: string): Promise<void> {
    const discipline = await this.disciplineRepository.findById(disciplineId);

    if (!discipline) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this id"
      });
    }

    if (discipline.coverImage) {
      const deleteCoverImage = await this.fileStorage.deleteFile(
        discipline.coverImage
      );

      if (!deleteCoverImage) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to delete discipline cover image"
        });
      }
    }

    await this.disciplineRepository.delete(disciplineId);
  }
}
