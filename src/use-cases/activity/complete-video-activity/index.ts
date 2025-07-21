import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteVideoActivityUseCaseRequest {
  userId: string;
  videoActivityId: string;
  isDailyMission?: boolean;
  isCorrect: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteVideoActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: CompleteVideoActivityUseCaseRequest): Promise<void> {
    const { activityType, isCorrect, userId, videoActivityId, isDailyMission } =
      params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const videoActivity =
      await this.activityRepository.findVideoById(videoActivityId);

    if (!videoActivity) {
      return this.exception.notFound({
        message: "Not found a video activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.VIDEO) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.VIDEO}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: videoActivityId,
      activityType,
      isCorrect,
      isDailyMission: isDailyMission ?? false,
      stepId: videoActivity.stepId,
      userId
    });
  }
}
