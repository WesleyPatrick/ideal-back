import { CompleteSentenceActivity } from "@domain/entities/complete-sentence-activity";
import { DialogActivity } from "@domain/entities/dialog-activity";
import { ImageActivity } from "@domain/entities/image-activity";
import { MultipleResponseActivity } from "@domain/entities/multiple-response-activity";
import { TrueOrFalseActivity } from "@domain/entities/true-or-false-activity";
import { VideoActivity } from "@domain/entities/video-activity";
import { ActivityRepository } from "@domain/repositories/activity";
import { DialogActivityComplete } from "@domain/repositories/finalTest";
import { PrismaService } from "@infra/config/prisma";
import { CompleteSentenceActivityMapper } from "@infra/mappers/complete-sentence-activity-mapper";
import { DialogActivityMapper } from "@infra/mappers/dialog-activity-mapper";
import { ImageActivityMapper } from "@infra/mappers/image-activity-mapper";
import { MultipleResponseActivityMapper } from "@infra/mappers/multiple-response-activity";
import { TrueOrFalseActivityMapper } from "@infra/mappers/true-or-false-activity-mapper";
import { VideoActivityMapper } from "@infra/mappers/video-activity-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaActivityRepository implements ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findDialogActivityWithSentencesById(
    dialogActivityId: string
  ): Promise<DialogActivityComplete | null> {
    const dialogActivityComplete = await this.prisma.dialogActivity.findUnique({
      where: {
        id: dialogActivityId
      },
      include: {
        sentences: true
      }
    });

    if (!dialogActivityComplete) {
      return null;
    }

    return DialogActivityMapper.toDomainWithSentences(dialogActivityComplete);
  }
  async findVideoById(videoActivityId: string): Promise<VideoActivity | null> {
    const videoActivity = await this.prisma.videoActivity.findUnique({
      where: {
        id: videoActivityId
      }
    });

    if (!videoActivity) {
      return null;
    }

    return VideoActivityMapper.toDomain(videoActivity);
  }

  async findDialogById(
    dialogActivityId: string
  ): Promise<DialogActivity | null> {
    const dialogActivity = await this.prisma.dialogActivity.findUnique({
      where: {
        id: dialogActivityId
      }
    });

    if (!dialogActivity) {
      return null;
    }

    return DialogActivityMapper.toDomain(dialogActivity);
  }

  async findMultipleResponseById(
    multipleResponseActivityId: string
  ): Promise<MultipleResponseActivity | null> {
    const multipleResponseActivity =
      await this.prisma.multipleResponseActivity.findUnique({
        where: {
          id: multipleResponseActivityId
        }
      });

    if (!multipleResponseActivity) {
      return null;
    }

    return MultipleResponseActivityMapper.toDomain(multipleResponseActivity);
  }

  async findImageById(imageActivityId: string): Promise<ImageActivity | null> {
    const imageActivity = await this.prisma.imageActivity.findUnique({
      where: {
        id: imageActivityId
      }
    });

    if (!imageActivity) {
      return null;
    }

    return ImageActivityMapper.toDomain(imageActivity);
  }

  async findCompleteSentenceById(
    completeSentenceActivityId: string
  ): Promise<CompleteSentenceActivity | null> {
    const completeSentenceActivity =
      await this.prisma.completeSentenceActivity.findUnique({
        where: {
          id: completeSentenceActivityId
        }
      });

    if (!completeSentenceActivity) {
      return null;
    }

    return CompleteSentenceActivityMapper.toDomain(completeSentenceActivity);
  }

  async findTrueOrFalseById(
    trueOrFalseActivityId: string
  ): Promise<TrueOrFalseActivity | null> {
    const trueOrFalseActivity =
      await this.prisma.trueOrFalseActivity.findUnique({
        where: {
          id: trueOrFalseActivityId
        }
      });

    if (!trueOrFalseActivity) {
      return null;
    }

    return TrueOrFalseActivityMapper.toDomain(trueOrFalseActivity);
  }
}
