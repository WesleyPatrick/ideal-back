import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FinalTestRepository,
  FindAllActivitiesInFinalTestResponse
} from "@domain/repositories/finalTest";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllActivitiesInFinalTestUseCase {
  constructor(
    private readonly finalTestRepository: FinalTestRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    finalTestId: string
  ): Promise<FindAllActivitiesInFinalTestResponse | void> {
    const finalTest = await this.finalTestRepository.findById(finalTestId);

    if (!finalTest) {
      return this.exception.notFound({
        message: "Not found a final test with this id"
      });
    }

    return await this.finalTestRepository.findAllActivitiesInFinalTest(
      finalTestId
    );
  }
}
