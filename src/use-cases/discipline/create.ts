import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { StorageFolderPaths } from "@domain/adapters/file-storage";
import {
  CreateDisciplineParams,
  CreateDisciplineResponse,
  DisciplineRepository
} from "@domain/repositories/discipline";
import { OperatorRepository } from "@domain/repositories/operator";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { getRandomColor } from "@use-cases/utils";

export type CreateDisciplineUseCaseParams = Omit<
  CreateDisciplineParams,
  "coverImage"
>;

@Injectable()
export class CreateDisciplineUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly disciplineRepository: DisciplineRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: CreateDisciplineUseCaseParams,
    coverImage: Express.Multer.File
  ): Promise<CreateDisciplineResponse | void> {
    const { author, missionTitles, moduleTitle, resume, title, operatorId } =
      params;

    const titleAlreadyExist =
      await this.disciplineRepository.findByTitle(title);

    if (titleAlreadyExist) {
      return this.exceptionAdapter.badRequest({
        message: "Already exist a discipline with this title"
      });
    }

    const haveOperatorWhitThisId =
      await this.operatorRepository.findById(operatorId);

    if (!haveOperatorWhitThisId) {
      return this.exceptionAdapter.notFound({
        message: "Not found a operator with this id"
      });
    }

    const coverUploadedPath = await this.uploadFileUseCase.upload(
      coverImage,
      StorageFolderPaths.DISCIPLINE_COVER
    );

    if (!coverUploadedPath) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to upload cover image"
      });
    }

    const newDiscipline = await this.disciplineRepository.create({
      author,
      coverImage: coverUploadedPath,
      missionTitles,
      moduleTitle,
      resume,
      title,
      operatorId,
      color: getRandomColor()
    });

    if (!newDiscipline) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to create a discipline"
      });
    }

    return newDiscipline;
  }
}
