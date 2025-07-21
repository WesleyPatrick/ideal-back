import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteImageActivityUseCaseRequest {
  userId: string;
  imageActivityId: string;
  isCorrect: boolean;
  isDailyMission?: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteImageActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: CompleteImageActivityUseCaseRequest): Promise<void> {
    const { activityType, imageActivityId, isCorrect, userId, isDailyMission } =
      params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const imageActivity =
      await this.activityRepository.findImageById(imageActivityId);

    if (!imageActivity) {
      return this.exception.notFound({
        message: "Not found a image activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.IMAGE) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.IMAGE}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: imageActivityId,
      activityType,
      isCorrect,
      isDailyMission: isDailyMission ?? false,
      stepId: imageActivity.stepId,
      userId
    });
  }
}
