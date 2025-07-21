import { FinalTest } from "@domain/entities/final-test";
import {
  FinalTestRepository,
  FindAllActivitiesInFinalTestResponse
} from "@domain/repositories/finalTest";
import { PrismaService } from "@infra/config/prisma";
import { CompleteSentenceActivityMapper } from "@infra/mappers/complete-sentence-activity-mapper";
import { DialogActivityMapper } from "@infra/mappers/dialog-activity-mapper";
import { FinalTestMapper } from "@infra/mappers/final-test-mapper";
import { ImageActivityMapper } from "@infra/mappers/image-activity-mapper";
import { MultipleResponseActivityMapper } from "@infra/mappers/multiple-response-activity";
import { TrueOrFalseActivityMapper } from "@infra/mappers/true-or-false-activity-mapper";
import { VideoActivityMapper } from "@infra/mappers/video-activity-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaFinalTestRepository implements FinalTestRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(finalTestId: string): Promise<FinalTest | null> {
    const finalTest = await this.prisma.finalTest.findUnique({
      where: {
        id: finalTestId
      }
    });

    if (!finalTest) {
      return null;
    }

    return FinalTestMapper.toDomain(finalTest);
  }

  async findAllActivitiesInFinalTest(
    finalTestId: string
  ): Promise<FindAllActivitiesInFinalTestResponse> {
    const finalTest = await this.prisma.finalTest.findUnique({
      where: {
        id: finalTestId
      },
      include: {
        VideoActivity: true,
        DialogActivity: {
          include: {
            sentences: true
          }
        },
        MultipleResponseActivity: {
          include: {
            responses: true
          }
        },
        ImageActivity: {
          include: {
            responses: true
          }
        },
        CompleteSentenceActivity: {
          include: {
            gaps: true
          }
        },
        TrueOrFalseActivity: {
          include: {
            items: true
          }
        }
      }
    });

    return {
      videoActivities: finalTest.VideoActivity.map(
        VideoActivityMapper.toDomain
      ),
      dialogActivities: finalTest.DialogActivity.map(
        DialogActivityMapper.toDomainWithSentences
      ),
      multipleResponseActivities: finalTest.MultipleResponseActivity.map(
        MultipleResponseActivityMapper.toDomainWithResponses
      ),
      imageActivities: finalTest.ImageActivity.map(
        ImageActivityMapper.toDomainWithResponses
      ),
      completeSentenceActivities: finalTest.CompleteSentenceActivity.map(
        CompleteSentenceActivityMapper.toDomainWithGaps
      ),
      trueOrFalseActivities: finalTest.TrueOrFalseActivity.map(
        TrueOrFalseActivityMapper.toDomainWithItems
      )
    };
  }
}
