import { FinalTest } from "@domain/entities/final-test";
import { Injectable } from "@nestjs/common";
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

export interface DialogActivityComplete extends DialogActivity {
  sentences: Sentence[];
}

export interface MultipleResponseActivityComplete
  extends MultipleResponseActivity {
  responses: Response[];
}

export interface ImageActivityComplete extends ImageActivity {
  responseImages: ResponseImage[];
}

export interface CompleteSentenceActivityComplete
  extends CompleteSentenceActivity {
  gaps: Gap[];
}

export interface TrueOrFalseActivityComplete extends TrueOrFalseActivity {
  trueOrFalseItems: TrueOrFalseItem[];
}

export interface FindAllActivitiesInFinalTestResponse {
  videoActivities: VideoActivity[];
  dialogActivities: DialogActivityComplete[];
  multipleResponseActivities: MultipleResponseActivityComplete[];
  imageActivities: ImageActivityComplete[];
  completeSentenceActivities: CompleteSentenceActivityComplete[];
  trueOrFalseActivities: TrueOrFalseActivityComplete[];
}

@Injectable()
export abstract class FinalTestRepository {
  abstract findById(finalTestId: string): Promise<FinalTest | null>;
  abstract findAllActivitiesInFinalTest(
    finalTestId: string
  ): Promise<FindAllActivitiesInFinalTestResponse>;
}
