import { Mission } from "@domain/entities/mission";
import { PaginatedEntity, PaginatedParams } from "@domain/entities/pagination";
import { SentencePersonIconEnum } from "@domain/entities/sentence-person-icon-enum";
import { Injectable } from "@nestjs/common";

export interface FindMissionByTitle {
  moduleId: string;
  missionTitle: string;
}

export interface CreateVideoActivity {
  url: string;
  isFinalTest?: boolean;
  stepPosition: number;
}

export interface CreateAnswers {
  text: string;
  isCorrect: boolean;
}

export interface CreateFileAnswers {
  file: string;
  isCorrect: boolean;
}

export interface CreateDialogSentence {
  character: SentencePersonIconEnum;
  text: string;
}

export interface CreateTrueOrFalseActivity {
  question: string;
  stepPosition: number;
  isFinalTest?: boolean;
  answers: CreateAnswers[];
}

export interface CreateImageActivity {
  question: string;
  stepPosition: number;
  isFinalTest?: boolean;
  answers: CreateFileAnswers[];
}

export interface CreateMultipleResponseActivity {
  question: string;
  isFinalTest?: boolean;
  stepPosition: number;
  answers: CreateAnswers[];
}

export interface CreateDialogActivity {
  dialogues: CreateDialogSentence[];
  stepPosition: number;
  isFinalTest?: boolean;
}

export interface CreateGap {
  index: number;
  options: string[];
  correct: string;
}

export interface CreateCompleteSentenceActivity {
  question: string;
  sentence: string;
  isFinalTest?: boolean;
  textParts: string[];
  stepPosition: number;
  gaps: CreateGap[];
}

export interface CreateStep {
  title: string;
  index: number;
  videoActivities?: CreateVideoActivity[];
  dialogActivities?: CreateDialogActivity[];
  trueOrFalseActivities?: CreateTrueOrFalseActivity[];
  multipleResponseActivities?: CreateMultipleResponseActivity[];
  imageActivities?: CreateImageActivity[];
  completeSentenceActivities?: CreateCompleteSentenceActivity[];
}

export interface EditMissionParams {
  initialVideo?: string;
  initialDialog?: Omit<CreateDialogActivity, "stepPosition">;
  articleFile: string;
  solecasActivity: number;
  solecasFinalTest: number;
  steps: CreateStep[];
}

export interface StepResume {
  id: string;
  title: string;
  index: number;
}

export interface FindAllMissionsAndStepsByModuleIdResponse {
  id: string;
  title: string;
  index: number;
  steps: StepResume[];
}

export interface FindByIdWithRelationsResponse {
  id: string;
  missionName: string;
  moduleId: string;
  moduleName: string;
  disciplineName: string;
}

export interface GetEmployeeMissionProgressParams {
  missionId: string;
  userId: string;
}

export interface GetEmployeeMissionProgressResponse {
  totalActivitiesMission: number;
  activitiesCorrectDone: number;
}

@Injectable()
export abstract class MissionRepository {
  abstract findByTitle(params: FindMissionByTitle): Promise<Mission | null>;

  abstract findById(missionId: string): Promise<Mission | null>;

  abstract findAllByModuleId(moduleId: string): Promise<Mission[]>;

  abstract editMission(
    missionId: string,
    params: EditMissionParams
  ): Promise<void>;

  abstract findAllMissionsAndStepsByModuleId(
    moduleId: string,
    params: PaginatedParams
  ): Promise<PaginatedEntity<FindAllMissionsAndStepsByModuleIdResponse>>;

  abstract findByIdWithRelations(
    missionId: string
  ): Promise<FindByIdWithRelationsResponse | null>;

  abstract getEmployeeMissionProgress(
    params: GetEmployeeMissionProgressParams
  ): Promise<GetEmployeeMissionProgressResponse>;
}
