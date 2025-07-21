import {
  ActivityResume,
  CountActivitiesDoneParams,
  FindAllActivitiesByStepIdResponse,
  FindAllStepsAndActivitiesByMissionIdResponse,
  StepRepository
} from "@domain/repositories/step";
import { Step } from "@domain/entities/step";
import { PrismaService } from "@infra/config/prisma";
import { StepMapper } from "@infra/mappers/step-mapper";
import { Injectable } from "@nestjs/common";
import { VideoActivityMapper } from "@infra/mappers/video-activity-mapper";
import { DialogActivityMapper } from "@infra/mappers/dialog-activity-mapper";
import { MultipleResponseActivityMapper } from "@infra/mappers/multiple-response-activity";
import { ImageActivityMapper } from "@infra/mappers/image-activity-mapper";
import { CompleteSentenceActivityMapper } from "@infra/mappers/complete-sentence-activity-mapper";
import { TrueOrFalseActivityMapper } from "@infra/mappers/true-or-false-activity-mapper";

@Injectable()
export class PrismaStepRepository implements StepRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countActivitiesDoneInStep(
    params: CountActivitiesDoneParams
  ): Promise<number> {
    const { stepId, userId } = params;

    return await this.prisma.activityAttempt.count({
      where: {
        stepId,
        userId
      }
    });
  }

  async findAllActivitiesByDailyStepId(
    stepId: string,
    userId: string
  ): Promise<FindAllActivitiesByStepIdResponse> {
    const activities = await this.prisma.step.findUnique({
      where: { id: stepId },
      include: {
        VideoActivity: true,
        DialogActivity: { include: { sentences: true } },
        MultipleResponseActivity: { include: { responses: true } },
        ImageActivity: { include: { responses: true } },
        CompleteSentenceActivity: { include: { gaps: true } },
        TrueOrFalseActivity: { include: { items: true } },
        ActivityAttempt: {
          where: {
            userId,
            stepId,
            isDailyMission: true
          }
        }
      }
    });

    const attempts = activities.ActivityAttempt;

    return {
      videoActivities: activities.VideoActivity.map((video) => ({
        ...VideoActivityMapper.toDomain(video),
        isComplete: attempts.some(
          (a) => a.activityId === video.id && a.activityType === "VIDEO"
        )
      })),
      dialogActivities: activities.DialogActivity.map((dialog) => ({
        ...DialogActivityMapper.toDomainWithSentences(dialog),
        isComplete: attempts.some(
          (a) => a.activityId === dialog.id && a.activityType === "DIALOG"
        )
      })),
      multipleResponseActivities: activities.MultipleResponseActivity.map(
        (mr) => ({
          ...MultipleResponseActivityMapper.toDomainWithResponses(mr),
          isComplete: attempts.some(
            (a) =>
              a.activityId === mr.id && a.activityType === "MULTIPLE_RESPONSE"
          )
        })
      ),
      imageActivities: activities.ImageActivity.map((image) => ({
        ...ImageActivityMapper.toDomainWithResponses(image),
        isComplete: attempts.some(
          (a) => a.activityId === image.id && a.activityType === "IMAGE"
        )
      })),
      completeSentenceActivities: activities.CompleteSentenceActivity.map(
        (cs) => ({
          ...CompleteSentenceActivityMapper.toDomainWithGaps(cs),
          isComplete: attempts.some(
            (a) =>
              a.activityId === cs.id && a.activityType === "COMPLETE_SENTENCE"
          )
        })
      ),
      trueOrFalseActivities: activities.TrueOrFalseActivity.map((tf) => ({
        ...TrueOrFalseActivityMapper.toDomainWithItems(tf),
        isComplete: attempts.some(
          (a) => a.activityId === tf.id && a.activityType === "TRUE_OR_FALSE"
        )
      }))
    };
  }

  async findAllActivitiesByStepId(
    stepId: string,
    userId: string
  ): Promise<FindAllActivitiesByStepIdResponse> {
    const activities = await this.prisma.step.findUnique({
      where: { id: stepId },
      include: {
        VideoActivity: true,
        DialogActivity: { include: { sentences: true } },
        MultipleResponseActivity: { include: { responses: true } },
        ImageActivity: { include: { responses: true } },
        CompleteSentenceActivity: { include: { gaps: true } },
        TrueOrFalseActivity: { include: { items: true } },
        ActivityAttempt: {
          where: {
            userId,
            stepId,
            isDailyMission: false
          }
        }
      }
    });

    const attempts = activities.ActivityAttempt;

    return {
      videoActivities: activities.VideoActivity.map((video) => ({
        ...VideoActivityMapper.toDomain(video),
        isComplete: attempts.some(
          (a) => a.activityId === video.id && a.activityType === "VIDEO"
        )
      })),
      dialogActivities: activities.DialogActivity.map((dialog) => ({
        ...DialogActivityMapper.toDomainWithSentences(dialog),
        isComplete: attempts.some(
          (a) => a.activityId === dialog.id && a.activityType === "DIALOG"
        )
      })),
      multipleResponseActivities: activities.MultipleResponseActivity.map(
        (mr) => ({
          ...MultipleResponseActivityMapper.toDomainWithResponses(mr),
          isComplete: attempts.some(
            (a) =>
              a.activityId === mr.id && a.activityType === "MULTIPLE_RESPONSE"
          )
        })
      ),
      imageActivities: activities.ImageActivity.map((image) => ({
        ...ImageActivityMapper.toDomainWithResponses(image),
        isComplete: attempts.some(
          (a) => a.activityId === image.id && a.activityType === "IMAGE"
        )
      })),
      completeSentenceActivities: activities.CompleteSentenceActivity.map(
        (cs) => ({
          ...CompleteSentenceActivityMapper.toDomainWithGaps(cs),
          isComplete: attempts.some(
            (a) =>
              a.activityId === cs.id && a.activityType === "COMPLETE_SENTENCE"
          )
        })
      ),
      trueOrFalseActivities: activities.TrueOrFalseActivity.map((tf) => ({
        ...TrueOrFalseActivityMapper.toDomainWithItems(tf),
        isComplete: attempts.some(
          (a) => a.activityId === tf.id && a.activityType === "TRUE_OR_FALSE"
        )
      }))
    };
  }

  async findById(stepId: string): Promise<Step | null> {
    const step = await this.prisma.step.findUnique({
      where: {
        id: stepId
      }
    });

    if (!step) {
      return null;
    }

    return StepMapper.toDomain(step);
  }

  async findAllStepsAndActivitiesByMissionId(
    missionId: string
  ): Promise<FindAllStepsAndActivitiesByMissionIdResponse[]> {
    const steps = await this.prisma.step.findMany({
      where: { missionId },
      select: {
        id: true,
        title: true,
        VideoActivity: { select: { id: true, stepPosition: true } },
        DialogActivity: { select: { id: true, stepPosition: true } },
        MultipleResponseActivity: { select: { id: true, stepPosition: true } },
        ImageActivity: { select: { id: true, stepPosition: true } },
        CompleteSentenceActivity: { select: { id: true, stepPosition: true } },
        TrueOrFalseActivity: { select: { id: true, stepPosition: true } }
      },
      orderBy: { index: "asc" }
    });

    return steps.map((step) => {
      const activities: ActivityResume[] = [];

      const merge = (acts?: { id: string; stepPosition: number }[]): void => {
        if (!acts) return;
        for (const a of acts) {
          activities.push({ id: a.id, index: a.stepPosition });
        }
      };

      merge(step.VideoActivity);
      merge(step.DialogActivity);
      merge(step.MultipleResponseActivity);
      merge(step.ImageActivity);
      merge(step.CompleteSentenceActivity);
      merge(step.TrueOrFalseActivity);

      activities.sort((a, b) => a.index - b.index);

      return {
        id: step.id,
        title: step.title,
        activities
      };
    });
  }
}
