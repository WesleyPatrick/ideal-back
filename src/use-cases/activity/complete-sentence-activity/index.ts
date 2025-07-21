import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteSentenceActivityUseCaseRequest {
  userId: string;
  sentenceActivityId: string;
  isCorrect: boolean;
  isDailyMission?: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteSentenceActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: CompleteSentenceActivityUseCaseRequest): Promise<void> {
    const {
      activityType,
      isCorrect,
      sentenceActivityId,
      userId,
      isDailyMission
    } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const sentenceActivity =
      await this.activityRepository.findCompleteSentenceById(
        sentenceActivityId
      );

    if (!sentenceActivity) {
      return this.exception.notFound({
        message: "Not found sentence activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.COMPLETE_SENTENCE) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.COMPLETE_SENTENCE}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: sentenceActivityId,
      activityType,
      isCorrect,
      isDailyMission: isDailyMission ?? false,
      stepId: sentenceActivity.stepId,
      userId
    });
  }
}
