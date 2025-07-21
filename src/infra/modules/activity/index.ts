import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { ActivityCompleteModule } from "../activity-complete";
import { ActivityController } from "@infra/controllers/activity";
import { CompleteDialogActivityUseCase } from "@use-cases/activity/complete-dialog-activity";
import { CompleteMultipleResponseActivityUseCase } from "@use-cases/activity/complete-multiple-response-activity";
import { CompleteImageActivityUseCase } from "@use-cases/activity/complete-image-activity";
import { CompleteSentenceActivityUseCase } from "@use-cases/activity/complete-sentence-activity";
import { CompleteTrueOrFalseActivityUseCase } from "@use-cases/activity/complete-true-or-false-activity";
import { CompleteVideoActivityUseCase } from "@use-cases/activity/complete-video-activity";
import { FindDialogActivityUseCase } from "@use-cases/activity/find-dialog-activity";

@Module({
  imports: [DatabaseModule, ExceptionsModule, ActivityCompleteModule],
  controllers: [ActivityController],
  providers: [
    CompleteDialogActivityUseCase,
    CompleteMultipleResponseActivityUseCase,
    CompleteImageActivityUseCase,
    CompleteSentenceActivityUseCase,
    CompleteTrueOrFalseActivityUseCase,
    CompleteVideoActivityUseCase,
    FindDialogActivityUseCase
  ]
})
export class ActivityModule {}
