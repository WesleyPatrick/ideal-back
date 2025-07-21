import { CompleteActivityParams } from "@domain/adapters/complete-activity";
import { PrismaService } from "@infra/config/prisma";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

export const ACTIVITY_QUEUE = "activity-queue";
export const ACTIVITY_ATTEMPT_JOB = "activity-attempt-job";

@Processor(ACTIVITY_QUEUE)
export class MakeActivityAttemptJob extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<CompleteActivityParams>): Promise<void> {
    const {
      activityId,
      activityType,
      stepId,
      userId,
      isCorrect,
      isDailyMission
    } = job.data;

    const existingAttempt = await this.prisma.activityAttempt.findUnique({
      where: {
        userId_activityId_isDailyMission: {
          userId,
          activityId,
          isDailyMission
        }
      }
    });

    if (existingAttempt) {
      await this.prisma.activityAttempt.update({
        where: {
          id: existingAttempt.id
        },
        data: {
          isCorrect
        }
      });

      return;
    }

    const query = await this.prisma.step.findUnique({
      where: { id: stepId },
      select: {
        missionId: true,
        mission: {
          select: {
            moduleId: true,
            module: {
              select: {
                disciplineId: true
              }
            }
          }
        }
      }
    });

    await this.prisma.activityAttempt.create({
      data: {
        activityId,
        activityType,
        isDailyMission,
        isCorrect,
        userId,
        stepId,
        missionId: query.missionId,
        moduleId: query.mission.moduleId,
        disciplineId: query.mission.module.disciplineId
      }
    });
  }
}
