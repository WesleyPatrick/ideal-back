import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteMultipleResponseActivityUseCaseRequest {
  userId: string;
  multipleResponseActivityId: string;
  isCorrect: boolean;
  isDailyMission?: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteMultipleResponseActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(
    params: CompleteMultipleResponseActivityUseCaseRequest
  ): Promise<void> {
    const {
      userId,
      activityType,
      isCorrect,
      multipleResponseActivityId,
      isDailyMission
    } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const multipleResponseActivity =
      await this.activityRepository.findMultipleResponseById(
        multipleResponseActivityId
      );

    if (!multipleResponseActivity) {
      return this.exception.notFound({
        message: "Not found a multiple response activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.MULTIPLE_RESPONSE) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.MULTIPLE_RESPONSE}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: multipleResponseActivityId,
      activityType,
      isDailyMission: isDailyMission ?? false,
      isCorrect,
      stepId: multipleResponseActivity.stepId,
      userId
    });
  }
}
