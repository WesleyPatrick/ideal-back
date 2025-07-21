import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { StorageFolderPaths } from "@domain/adapters/file-storage";
import { Prize } from "@domain/entities/prize";
import { PrizeRepository } from "@domain/repositories/prize";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { getRandomColor } from "@use-cases/utils";

export interface CreatePrizeUseCaseParams {
  name: string;
  solecasValue: number;
  moneyValue: number;
  description: string;
  color?: string;
  expiryDate: Date;
}

@Injectable()
export class CreatePrizeUseCase {
  constructor(
    private readonly prizeRepository: PrizeRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly execeptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: CreatePrizeUseCaseParams,
    image: Express.Multer.File
  ): Promise<Prize | void> {
    const { description, expiryDate, moneyValue, name, solecasValue, color } =
      params;

    const today = new Date();
    const expiryDateIsBiggerThanToday = expiryDate >= today;

    if (!expiryDateIsBiggerThanToday) {
      return this.execeptionAdapter.badRequest({
        message: "Expiry Date must be bigger than today"
      });
    }

    const newImagePath = await this.uploadFileUseCase.upload(
      image,
      StorageFolderPaths.PRIZE_COVER
    );

    if (!newImagePath) {
      return this.execeptionAdapter.internalServerError({
        message: "Error to upload image cover"
      });
    }

    return await this.prizeRepository.create({
      description,
      expiryDate,
      image: newImagePath,
      moneyValue,
      name,
      color: color ?? getRandomColor(),
      solecasValue
    });
  }
}
