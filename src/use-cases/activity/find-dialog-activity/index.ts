import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityRepository } from "@domain/repositories/activity";
import { DialogActivityComplete } from "@domain/repositories/finalTest";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDialogActivityUseCase {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    dialogActivityId: string
  ): Promise<DialogActivityComplete | void> {
    const dialogActivityWithSentences =
      await this.activityRepository.findDialogActivityWithSentencesById(
        dialogActivityId
      );

    if (!dialogActivityWithSentences) {
      return this.exception.notFound({
        message: "Not found a dialog activity with this id"
      });
    }

    return dialogActivityWithSentences;
  }
}
