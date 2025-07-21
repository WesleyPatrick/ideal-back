import { VideoActivity } from "@domain/entities/video-activity";
import { VideoActivity as PrismaVideoActivity } from "@prisma/client";

export class VideoActivityMapper {
  static toDomain(videoActivity: PrismaVideoActivity): VideoActivity {
    return {
      id: videoActivity.id,
      link: videoActivity.link,
      stepPosition: videoActivity.stepPosition,
      solecasAmount: videoActivity.solecasAmount,
      stepId: videoActivity.stepId,
      finalTestId: videoActivity.finalTestId,
      createdAt: videoActivity.createdAt,
      updatedAt: videoActivity.updatedAt
    };
  }

  static toPersistence(videoActivity: VideoActivity): PrismaVideoActivity {
    return {
      id: videoActivity.id,
      link: videoActivity.link,
      stepPosition: videoActivity.stepPosition,
      solecasAmount: videoActivity.solecasAmount,
      stepId: videoActivity.stepId,
      finalTestId: videoActivity.finalTestId,
      createdAt: videoActivity.createdAt,
      updatedAt: videoActivity.updatedAt
    };
  }
}
