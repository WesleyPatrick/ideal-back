import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { StorageFolderPaths } from "@domain/adapters/file-storage";
import {
  CreateCompleteSentenceActivity,
  CreateDialogActivity,
  CreateMultipleResponseActivity,
  CreateTrueOrFalseActivity,
  CreateVideoActivity,
  MissionRepository
} from "@domain/repositories/mission";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface CreateFileAnswers {
  isCorrect: boolean;
}

export interface CreateImageActivity {
  question: string;
  stepPosition: number;
  isFinalTest?: boolean;
  answers: CreateFileAnswers[];
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

export interface EditMissionUseCaseParams {
  initialVideo?: string;
  initialDialog?: Omit<CreateDialogActivity, "stepPosition">;
  solecasActivity: number;
  solecasFinalTest: number;
  steps: CreateStep[];
}

@Injectable()
export class EditMissionUseCase {
  constructor(
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly missionRepository: MissionRepository
  ) {}

  async execute(
    missionId: string,
    params: EditMissionUseCaseParams,
    articleFile: Express.Multer.File,
    imagesFiles: Express.Multer.File[]
  ): Promise<void> {
    const {
      steps,
      initialDialog,
      initialVideo,
      solecasActivity,
      solecasFinalTest
    } = params;

    const mission = await this.missionRepository.findById(missionId);

    if (!mission) {
      return this.exceptionAdapter.notFound({
        message: "Not found a mission with this id"
      });
    }

    const dontHaveInitialVideoOrInitialDialog =
      (!initialDialog && !initialVideo) || (initialDialog && initialVideo);

    if (dontHaveInitialVideoOrInitialDialog) {
      return this.exceptionAdapter.badRequest({
        message: "There must be at least one initial video or initial dialog"
      });
    }

    const STEP_NUMBER = 5;
    const ACTIVITIES_PER_STEP = 5;

    const totalSteps = steps.length !== STEP_NUMBER;

    if (totalSteps) {
      return this.exceptionAdapter.badRequest({
        message: `You need create ${STEP_NUMBER} steps`
      });
    }

    for (const step of steps) {
      const stepTotalActivities = this.totalActivitiesPerStep(step);

      if (stepTotalActivities !== ACTIVITIES_PER_STEP) {
        return this.exceptionAdapter.badRequest({
          message: `Each step needs to have ${ACTIVITIES_PER_STEP} activities`
        });
      }

      const totalDifferenceStepPositions = this.totalStepPositionsPerStep(step);

      if (totalDifferenceStepPositions !== stepTotalActivities) {
        return this.exceptionAdapter.badRequest({
          message: `There can be no equal step positions on the step ${step.title}`
        });
      }
    }

    const articleFilePath = await this.uploadFileUseCase.upload(
      articleFile,
      StorageFolderPaths.ACTIVITY_INSTRUCTION
    );

    if (!articleFilePath) {
      return this.exceptionAdapter.internalServerError({
        message: "Erro to upload article file"
      });
    }

    const uploadedImagePaths = await Promise.all(
      imagesFiles.map((imageFile) =>
        this.uploadFileUseCase.upload(
          imageFile,
          StorageFolderPaths.IMAGE_ACTIVITY
        )
      )
    );

    if (uploadedImagePaths.some((path) => !path)) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to upload one or more image files"
      });
    }

    let imageFileIndex = 0;
    const stepsWithFileUrls = steps.map((step) => ({
      ...step,
      imageActivities: step.imageActivities?.map((activity) => ({
        ...activity,
        answers: activity.answers.map((answer) => {
          const imageFilePath = uploadedImagePaths[imageFileIndex];
          imageFileIndex++;
          return {
            ...answer,
            file: imageFilePath as string
          };
        })
      }))
    }));

    await this.missionRepository.editMission(missionId, {
      articleFile: articleFilePath,
      steps: stepsWithFileUrls,
      initialDialog,
      initialVideo,
      solecasActivity,
      solecasFinalTest
    });
  }

  private totalActivitiesPerStep(step: CreateStep): number {
    const {
      completeSentenceActivities,
      dialogActivities,
      imageActivities,
      multipleResponseActivities,
      trueOrFalseActivities,
      videoActivities
    } = step;

    return (
      (completeSentenceActivities?.length || 0) +
      (dialogActivities?.length || 0) +
      (imageActivities?.length || 0) +
      (multipleResponseActivities?.length || 0) +
      (trueOrFalseActivities?.length || 0) +
      (videoActivities?.length || 0)
    );
  }

  private totalStepPositionsPerStep(step: CreateStep): number {
    const stepPositions = new Set<number>();

    const allActivities = [
      ...(step.videoActivities || []),
      ...(step.dialogActivities || []),
      ...(step.imageActivities || []),
      ...(step.trueOrFalseActivities || []),
      ...(step.multipleResponseActivities || []),
      ...(step.completeSentenceActivities || [])
    ];

    allActivities.forEach((activity) => {
      stepPositions.add(activity.stepPosition);
    });

    return stepPositions.size;
  }
}
