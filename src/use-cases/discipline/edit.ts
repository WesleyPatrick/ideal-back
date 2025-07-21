import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Discipline } from "@domain/entities/discipline";
import { DisciplineRepository } from "@domain/repositories/discipline";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface EditDisciplineUseCaseParams {
  title?: string;
  author?: string;
  resume?: string;
}

@Injectable()
export class EditDisciplineUseCase {
  constructor(
    private readonly disciplineRepository: DisciplineRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    disciplineId: string,
    params: EditDisciplineUseCaseParams,
    newCoverImage?: Express.Multer.File
  ): Promise<Discipline | void> {
    const { author, resume, title } = params;

    const discipline = await this.disciplineRepository.findById(disciplineId);

    if (!discipline) {
      return this.exceptionAdapter.notFound({
        message: "Not found a discipline with this id"
      });
    }

    if (title) {
      const titleAlreadyExist =
        await this.disciplineRepository.findByTitle(title);

      if (titleAlreadyExist) {
        return this.exceptionAdapter.badRequest({
          message: "This title already exists"
        });
      }
    }

    let newCoverImagePath = null;

    if (newCoverImage) {
      const deleteActualCoverImage = await this.fileStorage.deleteFile(
        discipline.coverImage
      );

      if (!deleteActualCoverImage) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to delete actual cover image"
        });
      }

      newCoverImagePath = await this.uploadFileUseCase.upload(
        newCoverImage,
        StorageFolderPaths.DISCIPLINE_COVER
      );

      if (!newCoverImagePath) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to update new cover image"
        });
      }
    }

    return await this.disciplineRepository.edit(disciplineId, {
      author: author ?? discipline.author,
      coverImage: newCoverImagePath ?? discipline.coverImage,
      resume: resume ?? discipline.resume,
      title: title ?? discipline.title
    });
  }
}
