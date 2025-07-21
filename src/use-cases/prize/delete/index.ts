import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { FileStorageAdapter } from "@domain/adapters/file-storage";
import { PrizeRepository } from "@domain/repositories/prize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeletePrizeUseCase {
  constructor(
    private readonly prizeRepository: PrizeRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(prizeId: string): Promise<void> {
    const prize = await this.prizeRepository.findById(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    if (prize.image) {
      const deletePrizeImage = await this.fileStorage.deleteFile(prize.image);

      if (!deletePrizeImage) {
        return this.exceptionAdapter.internalServerError({
          message: "Error to delete prize image"
        });
      }
    }

    const deletedPrize = await this.prizeRepository.delete(prizeId);

    if (!deletedPrize) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to delete a prize"
      });
    }
  }
}
