import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { Prize } from "@domain/entities/prize";
import { PrizeRepository } from "@domain/repositories/prize";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdatePrizeUseCaseParams {
  name?: string;
  solecasValue?: number;
  moneyValue?: number;
  description?: string;
  color?: string;
  expiryDate?: Date;
}

@Injectable()
export class UpdatePrizeUseCase {
  constructor(
    private readonly prizeRepository: PrizeRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    prizeId: string,
    params: UpdatePrizeUseCaseParams,
    newImage?: Express.Multer.File
  ): Promise<Prize | void> {
    const { description, expiryDate, moneyValue, name, solecasValue, color } =
      params;

    const prize = await this.prizeRepository.findById(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    const today = new Date();

    if (expiryDate <= today) {
      return this.exceptionAdapter.badRequest({
        message: "Expiry date must be bigger than today"
      });
    }

    let newImagePath = null;

    if (newImage) {
      const deleteActualImage = await this.fileStorage.deleteFile(prize.image);

      if (!deleteActualImage) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to delete actual prize image"
        });
      }

      newImagePath = await this.uploadFileUseCase.upload(
        newImage,
        StorageFolderPaths.PRIZE_COVER
      );

      if (!newImagePath) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to update new prize image"
        });
      }
    }

    return await this.prizeRepository.update(prizeId, {
      description: description ?? prize.description,
      expiryDate: expiryDate ?? prize.expiryDate,
      image: newImagePath ?? prize.image,
      moneyValue: moneyValue ?? prize.moneyValue,
      name: name ?? prize.name,
      solecasValue: solecasValue ?? prize.solecasValue,
      color: color ?? prize.color
    });
  }
}
