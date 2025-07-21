import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CompleteDialogActivityUseCase } from "@use-cases/activity/complete-dialog-activity";
import { CompleteDialogActivityDto } from "./dtos/complete-dialog-activity-dto";
import { CompleteDialogActivityResponses } from "@infra/config/swagger/responses/activity/complete-dialog-activity";
import { CompleteMultipleResponseActivityUseCase } from "@use-cases/activity/complete-multiple-response-activity";
import { CompleteMultipleResponseActivityDto } from "./dtos/multiple-response-activity-dto";
import { CompleteMultipleResponseActivityResponses } from "@infra/config/swagger/responses/activity/complete-multiple-response-activity";
import { CompleteImageActivityResponses } from "@infra/config/swagger/responses/activity/complete-image-activity";
import { CompleteImageActivityDto } from "./dtos/complete-image-activity-dto";
import { CompleteImageActivityUseCase } from "@use-cases/activity/complete-image-activity";
import { CompleteSentenceActivityUseCase } from "@use-cases/activity/complete-sentence-activity";
import { CompleteSentenceActivityDto } from "./dtos/complete-sentence-activity-dto";
import { CompleteSenteceActivityResponses } from "@infra/config/swagger/responses/activity/complete-sentence-activity";
import { CompleteTrueOrFalseActivityUseCase } from "@use-cases/activity/complete-true-or-false-activity";
import { CompleteTrueOrFalseActivityDto } from "./dtos/complete-true-or-false-activity-dto";
import { CompleteTrueOrFalseActivityResponses } from "@infra/config/swagger/responses/activity/complete-true-or-false-activity";
import { CompleteVideoActivityUseCase } from "@use-cases/activity/complete-video-activity";
import { CompleteVideoActivityResponses } from "@infra/config/swagger/responses/activity/complete-video-activity";
import { CompleteVideoActivityDto } from "./dtos/complete-video-activity-dto";
import { FindDialogActivityUseCase } from "@use-cases/activity/find-dialog-activity";
import { FindDialogActivityWithSentencesResponses } from "@infra/config/swagger/responses/activity/find-dialog-activity-with-sentences";
import { DialogActivityComplete } from "@domain/repositories/finalTest";

@Controller("activity")
export class ActivityController {
  constructor(
    private readonly completeDialogActivityUseCase: CompleteDialogActivityUseCase,
    private readonly completeMultipleResponseActivityUseCase: CompleteMultipleResponseActivityUseCase,
    private readonly completeImageActivityUseCase: CompleteImageActivityUseCase,
    private readonly completeSentenceActivityUseCase: CompleteSentenceActivityUseCase,
    private readonly completeTrueOrFalseActivityUseCase: CompleteTrueOrFalseActivityUseCase,
    private readonly completeVideoActivityUseCase: CompleteVideoActivityUseCase,
    private readonly findDialogActivityUseCase: FindDialogActivityUseCase
  ) {}

  @HttpCode(204)
  @Post("dialog/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteDialogActivityResponses
  async dialogActivityComplete(
    @Body() body: CompleteDialogActivityDto
  ): Promise<void> {
    return await this.completeDialogActivityUseCase.execute(body);
  }

  @HttpCode(204)
  @Post("multiple-response/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteMultipleResponseActivityResponses
  async multipleResponseActivityComplete(
    @Body() body: CompleteMultipleResponseActivityDto
  ): Promise<void> {
    return await this.completeMultipleResponseActivityUseCase.execute(body);
  }

  @HttpCode(204)
  @Post("image/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteImageActivityResponses
  async imageActivityComplete(
    @Body() body: CompleteImageActivityDto
  ): Promise<void> {
    return await this.completeImageActivityUseCase.execute(body);
  }

  @HttpCode(204)
  @Post("sentence/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteSenteceActivityResponses
  async sentenceActivityComplete(
    @Body() body: CompleteSentenceActivityDto
  ): Promise<void> {
    return await this.completeSentenceActivityUseCase.execute(body);
  }

  @HttpCode(204)
  @Post("true-or-false/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteTrueOrFalseActivityResponses
  async trueOrFalseActivityComplete(
    @Body() body: CompleteTrueOrFalseActivityDto
  ): Promise<void> {
    return await this.completeTrueOrFalseActivityUseCase.execute(body);
  }

  @HttpCode(204)
  @Post("video/complete")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CompleteVideoActivityResponses
  async videoActivityComplete(
    @Body() body: CompleteVideoActivityDto
  ): Promise<void> {
    return await this.completeVideoActivityUseCase.execute(body);
  }

  @Get("dialog/:dialogActivityId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindDialogActivityWithSentencesResponses
  async findDialogActivityWithSentences(
    @Param("dialogActivityId") dialogActivityId: string
  ): Promise<DialogActivityComplete | void> {
    return await this.findDialogActivityUseCase.execute(dialogActivityId);
  }
}
