import { Mission } from "@domain/entities/mission";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import {
  EditMissionParams,
  FindAllMissionsAndStepsByModuleIdResponse,
  FindByIdWithRelationsResponse,
  FindMissionByTitle,
  GetEmployeeMissionProgressParams,
  GetEmployeeMissionProgressResponse,
  MissionRepository
} from "@domain/repositories/mission";
import { PrismaService } from "@infra/config/prisma";
import { MissionMapper } from "@infra/mappers/mission-mapper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaMissionRepository implements MissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeMissionProgress(
    params: GetEmployeeMissionProgressParams
  ): Promise<GetEmployeeMissionProgressResponse> {
    const { missionId, userId } = params;

    const ACTIVITIES_PER_STEP = 5;

    const query = await this.prisma.$queryRaw<
      { validSteps: number; activitiesDone: number }[]
    >(Prisma.sql`
          WITH activities_done_correct AS (
            SELECT 
              COUNT(DISTINCT aa.activity_id) as "activities_done"
            FROM activity_attempts aa
            WHERE aa.mission_id = ${missionId}
              AND aa.is_correct = true
              AND aa.user_id = ${userId}
          ),
          valid_steps AS (
            SELECT
              COUNT(DISTINCT pa.step_id) as "step_count"
            FROM users u
            JOIN employees e ON e.user_id = u.id
            JOIN profiles p ON p.id = e.profile_id
            JOIN profile_accesses pa ON pa.profile_id = p.id
            WHERE u.id = ${userId}
              AND pa.mission_id = ${missionId}
          )
          SELECT
            adc.activities_done as "activitiesDone",
            vs.step_count as "validSteps"
          FROM activities_done_correct adc
          CROSS JOIN valid_steps vs;
        `);

    const result = query[0];

    const totalActivitiesMission =
      Number(result.validSteps) * ACTIVITIES_PER_STEP;

    return {
      activitiesCorrectDone: Number(result.activitiesDone),
      totalActivitiesMission
    };
  }

  async findByIdWithRelations(
    missionId: string
  ): Promise<FindByIdWithRelationsResponse | null> {
    const mission = await this.prisma.mission.findUnique({
      where: {
        id: missionId
      },
      select: {
        id: true,
        moduleId: true,
        title: true,
        module: {
          select: {
            title: true,
            Discipline: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    if (!mission) {
      return null;
    }

    return {
      id: mission.id,
      moduleId: mission.moduleId,
      missionName: mission.title,
      moduleName: mission.module.title,
      disciplineName: mission.module.Discipline.title
    };
  }

  async findAllMissionsAndStepsByModuleId(
    moduleId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllMissionsAndStepsByModuleIdResponse>> {
    const { page, pageSize } = params;

    const { total, missions } = await this.prisma.$transaction(async (tx) => {
      const total = await tx.mission.count({
        where: {
          moduleId
        }
      });

      const missions = await tx.mission.findMany({
        where: {
          moduleId
        },
        select: {
          id: true,
          title: true,
          index: true,
          steps: {
            select: {
              id: true,
              title: true,
              index: true
            },
            orderBy: {
              index: "asc"
            }
          }
        },
        orderBy: {
          index: "asc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      });

      return { total, missions };
    });

    return {
      data: missions,
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async editMission(
    missionId: string,
    params: EditMissionParams
  ): Promise<void> {
    const {
      articleFile,
      steps,
      initialDialog,
      initialVideo,
      solecasActivity,
      solecasFinalTest
    } = params;

    await this.prisma.$transaction(async (tx) => {
      let dialogActivityId: string | null = null;

      const finalTest = await tx.finalTest.create({
        data: {
          missionId,
          solecasAmount: solecasFinalTest
        }
      });

      if (initialDialog) {
        const initialDialogCreated = await tx.dialogActivity.create({
          data: {
            stepPosition: 0,
            solecasAmount: 0,
            sentences: {
              create: initialDialog.dialogues.map((dialogue, index) => ({
                person: dialogue.character,
                text: dialogue.text,
                index
              }))
            }
          }
        });

        dialogActivityId = initialDialogCreated.id;
      }

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        const createdStep = await tx.step.create({
          data: {
            index: step.index,
            title: step.title,
            missionId
          }
        });

        if (step.videoActivities) {
          for (const video of step.videoActivities) {
            await tx.videoActivity.create({
              data: {
                link: video.url,
                solecasAmount: solecasActivity,
                stepPosition: video.stepPosition,
                stepId: createdStep.id,
                finalTestId: video.isFinalTest ? finalTest.id : undefined
              }
            });
          }
        }

        if (step.dialogActivities) {
          for (const dialog of step.dialogActivities) {
            await tx.dialogActivity.create({
              data: {
                stepPosition: dialog.stepPosition,
                solecasAmount: solecasActivity,
                stepId: createdStep.id,
                finalTestId: dialog.isFinalTest ? finalTest.id : undefined,
                sentences: {
                  create: dialog.dialogues.map((sentence, index) => ({
                    person: sentence.character,
                    text: sentence.text,
                    index
                  }))
                }
              }
            });
          }
        }

        if (step.trueOrFalseActivities) {
          for (const tf of step.trueOrFalseActivities) {
            await tx.trueOrFalseActivity.create({
              data: {
                question: tf.question,
                solecasAmount: solecasActivity,
                stepPosition: tf.stepPosition,
                stepId: createdStep.id,
                finalTestId: tf.isFinalTest ? finalTest.id : undefined,
                items: {
                  create: tf.answers.map((answer) => ({
                    text: answer.text,
                    isTrue: answer.isCorrect
                  }))
                }
              }
            });
          }
        }

        if (step.multipleResponseActivities) {
          for (const multi of step.multipleResponseActivities) {
            await tx.multipleResponseActivity.create({
              data: {
                question: multi.question,
                solecasAmount: solecasActivity,
                stepPosition: multi.stepPosition,
                stepId: createdStep.id,
                finalTestId: multi.isFinalTest ? finalTest.id : undefined,
                responses: {
                  create: multi.answers.map((answer) => ({
                    text: answer.text,
                    isCorrect: answer.isCorrect
                  }))
                }
              }
            });
          }
        }

        if (step.imageActivities) {
          for (const image of step.imageActivities) {
            await tx.imageActivity.create({
              data: {
                question: image.question,
                solecasAmount: solecasActivity,
                stepPosition: image.stepPosition,
                stepId: createdStep.id,
                finalTestId: image.isFinalTest ? finalTest.id : undefined,
                responses: {
                  create: image.answers.map((answer) => ({
                    imageFile: answer.file,
                    isCorrect: answer.isCorrect
                  }))
                }
              }
            });
          }
        }

        if (step.completeSentenceActivities) {
          for (const complete of step.completeSentenceActivities) {
            await tx.completeSentenceActivity.create({
              data: {
                question: complete.question,
                solecasAmount: solecasActivity,
                textParts: complete.textParts,
                stepPosition: complete.stepPosition,
                stepId: createdStep.id,
                finalTestId: complete.isFinalTest ? finalTest.id : undefined,
                gaps: {
                  create: complete.gaps.map((gap) => ({
                    index: gap.index,
                    correct: gap.correct,
                    options: gap.options
                  }))
                }
              }
            });
          }
        }
      }

      await tx.mission.update({
        where: { id: missionId },
        data: {
          articleFile,
          dialogActivityId,
          initialVideo
        }
      });
    });
  }

  async findAllByModuleId(moduleId: string): Promise<Mission[]> {
    const missions = await this.prisma.mission.findMany({
      where: {
        moduleId
      }
    });

    return missions.map(MissionMapper.toDomain);
  }

  async findById(missionId: string): Promise<Mission | null> {
    const mission = await this.prisma.mission.findUnique({
      where: {
        id: missionId
      }
    });

    if (!mission) {
      return null;
    }

    return MissionMapper.toDomain(mission);
  }

  async findByTitle(params: FindMissionByTitle): Promise<Mission | null> {
    const { moduleId, missionTitle } = params;

    const mission = await this.prisma.mission.findFirst({
      where: {
        moduleId,
        title: missionTitle
      }
    });

    if (!mission) {
      return null;
    }

    return MissionMapper.toDomain(mission);
  }
}
