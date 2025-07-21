import { CompleteActivityAdapter } from "@domain/adapters/complete-activity";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";
import { ActivityRepository } from "@domain/repositories/activity";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

interface CompleteDialogActivityUseCaseRequest {
  userId: string;
  dialogActivityId: string;
  isDailyMission?: boolean;
  isCorrect: boolean;
  activityType: ActivityTypeEnum;
}

@Injectable()
export class CompleteDialogActivityUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly completeActivityAdapter: CompleteActivityAdapter,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(params: CompleteDialogActivityUseCaseRequest): Promise<void> {
    const {
      activityType,
      dialogActivityId,
      isCorrect,
      userId,
      isDailyMission
    } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exception.notFound({
        message: "Not found a user with this id"
      });
    }

    const dialogActivity =
      await this.activityRepository.findDialogById(dialogActivityId);

    if (!dialogActivity) {
      return this.exception.notFound({
        message: "Not found a dialog activity with this id"
      });
    }

    if (activityType !== ActivityTypeEnum.DIALOG) {
      return this.exception.badRequest({
        message: `Activity type must be ${ActivityTypeEnum.DIALOG}`
      });
    }

    await this.completeActivityAdapter.completeActivity({
      activityId: dialogActivityId,
      activityType,
      isCorrect,
      isDailyMission: isDailyMission ?? false,
      stepId: dialogActivity.stepId,
      userId
    });
  }
}
