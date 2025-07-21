import { CompleteSentenceActivity } from "@domain/entities/complete-sentence-activity";
import { DialogActivity } from "@domain/entities/dialog-activity";
import { ImageActivity } from "@domain/entities/image-activity";
import { MultipleResponseActivity } from "@domain/entities/multiple-response-activity";
import { TrueOrFalseActivity } from "@domain/entities/true-or-false-activity";
import { VideoActivity } from "@domain/entities/video-activity";
import { Injectable } from "@nestjs/common";
import { DialogActivityComplete } from "./finalTest";

export interface CountCorrectStepActivityParams {
  userId: string;
  stepId: string;
}

export interface CountCorrectMissionActivityParams {
  userId: string;
  missionId: string;
}

export interface CountCorrectModuleActivityParams {
  userId: string;
  moduleId: string;
}

export interface CountCorrectDisciplineActivityParams {
  userId: string;
  disciplineId: string;
}

@Injectable()
export abstract class ActivityRepository {
  abstract findVideoById(
    videoActivityId: string
  ): Promise<VideoActivity | null>;
  abstract findDialogById(
    dialogActivityId: string
  ): Promise<DialogActivity | null>;
  abstract findMultipleResponseById(
    multipleResponseActivityId: string
  ): Promise<MultipleResponseActivity | null>;
  abstract findImageById(
    imageActivityId: string
  ): Promise<ImageActivity | null>;
  abstract findCompleteSentenceById(
    completeSentenceActivityId: string
  ): Promise<CompleteSentenceActivity | null>;
  abstract findTrueOrFalseById(
    trueOrFalseActivityId: string
  ): Promise<TrueOrFalseActivity | null>;
  abstract findDialogActivityWithSentencesById(
    dialogActivityId: string
  ): Promise<DialogActivityComplete | null>;
}
