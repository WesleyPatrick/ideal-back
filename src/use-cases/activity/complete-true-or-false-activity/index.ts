import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteTrueOrFalseActivityUseCaseRequest {
  userId: string;
  trueOrFalseActivityId: string;
  isCorrect: boolean;
  isDailyMission?: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteTrueOrFalseActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: CompleteTrueOrFalseActivityUseCaseRequest
  ): Promise<void> {
    const {
      activityType,
      isCorrect,
      trueOrFalseActivityId,
      userId,
      isDailyMission
    } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const trueOrFalseActivity =
      await this.activityRepository.findTrueOrFalseById(trueOrFalseActivityId);

    if (!trueOrFalseActivity) {
      return this.exception.notFound({
        message: "Not found true or false activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.TRUE_OR_FALSE) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.TRUE_OR_FALSE}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: trueOrFalseActivityId,
      activityType,
      isCorrect,
      isDailyMission: isDailyMission ?? false,
      stepId: trueOrFalseActivity.stepId,
      userId
    });
  }
}
