import { Injectable } from "@nestjs/common";
import { Step } from "@domain/entities/step";
import { VideoActivity } from "@domain/entities/video-activity";
import { DialogActivity } from "@domain/entities/dialog-activity";
import { Sentence } from "@domain/entities/sentence";
import { MultipleResponseActivity } from "@domain/entities/multiple-response-activity";
import { Response } from "@domain/entities/response";
import { ImageActivity } from "@domain/entities/image-activity";
import { ResponseImage } from "@domain/entities/response-image";
import { CompleteSentenceActivity } from "@domain/entities/complete-sentence-activity";
import { Gap } from "@domain/entities/gap";
import { TrueOrFalseActivity } from "@domain/entities/true-or-false-activity";
import { TrueOrFalseItem } from "@domain/entities/true-or-false-item";

export interface ActivityResume {
  id: string;
  index: number;
}

export interface FindAllStepsAndActivitiesByMissionIdResponse {
  id: string;
  title: string;
  activities: ActivityResume[];
}

export interface VideoActivityWithIsComplete extends VideoActivity {
  isComplete: boolean;
}

export interface DialogActivityCompleteWithIsComplete extends DialogActivity {
  sentences: Sentence[];
  isComplete: boolean;
}

export interface MultipleResponseActivityCompleteWithIsComplete
  extends MultipleResponseActivity {
  responses: Response[];
  isComplete: boolean;
}

export interface ImageActivityCompleteWithIsComplete extends ImageActivity {
  responseImages: ResponseImage[];
  isComplete: boolean;
}

export interface CompleteSentenceActivityCompleteWithIsComplete
  extends CompleteSentenceActivity {
  gaps: Gap[];
  isComplete: boolean;
}

export interface TrueOrFalseActivityCompleteWithIsComplete
  extends TrueOrFalseActivity {
  trueOrFalseItems: TrueOrFalseItem[];
  isComplete: boolean;
}

export interface FindAllActivitiesByStepIdResponse {
  videoActivities: VideoActivityWithIsComplete[];
  dialogActivities: DialogActivityCompleteWithIsComplete[];
  multipleResponseActivities: MultipleResponseActivityCompleteWithIsComplete[];
  imageActivities: ImageActivityCompleteWithIsComplete[];
  completeSentenceActivities: CompleteSentenceActivityCompleteWithIsComplete[];
  trueOrFalseActivities: TrueOrFalseActivityCompleteWithIsComplete[];
}

export interface CountActivitiesDoneParams {
  userId: string;
  stepId: string;
}

@Injectable()
export abstract class StepRepository {
  abstract findById(stepId: string): Promise<Step | null>;
  abstract findAllStepsAndActivitiesByMissionId(
    missionId: string
  ): Promise<FindAllStepsAndActivitiesByMissionIdResponse[]>;
  abstract findAllActivitiesByStepId(
    stepId: string,
    userId: string
  ): Promise<FindAllActivitiesByStepIdResponse>;
  abstract countActivitiesDoneInStep(
    params: CountActivitiesDoneParams
  ): Promise<number>;
  abstract findAllActivitiesByDailyStepId(
    stepId: string,
    userId: string
  ): Promise<FindAllActivitiesByStepIdResponse>;
}
