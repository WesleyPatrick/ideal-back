import { ApiBadRequestResponse, ApiProperty } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class VideoActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() link: string;
  @ApiProperty() stepPosition: number;
  @ApiProperty() solecasAmount: number;
  @ApiProperty() stepId: string;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty() isComplete: boolean;
}

export class SentenceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() person: string;
  @ApiProperty() index: number;
  @ApiProperty() text: string;
  @ApiProperty() dialogActivityId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class DialogActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() solecasAmount: number;
  @ApiProperty() stepPosition: number;
  @ApiProperty() stepId: string;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty() isComplete: boolean;
  @ApiProperty({ type: [SentenceResponseDto] })
  sentences: SentenceResponseDto[];
}

export class MultipleResponseOptionDto {
  @ApiProperty() id: string;
  @ApiProperty() text: string;
  @ApiProperty() isCorrect: boolean;
  @ApiProperty() multipleResponseActivityId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class MultipleResponseActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() question: string;
  @ApiProperty() solecasAmount: number;
  @ApiProperty() stepPosition: number;
  @ApiProperty() stepId: string;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ type: [MultipleResponseOptionDto] })
  responses: MultipleResponseOptionDto[];
  @ApiProperty() isComplete: boolean;
}

export class ImageResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() imageFile: string;
  @ApiProperty() isCorrect: boolean;
  @ApiProperty() imageActivityId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class ImageActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() question: string;
  @ApiProperty() stepPosition: number;
  @ApiProperty() solecasAmount: number;
  @ApiProperty() stepId: string;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ type: [ImageResponseDto] }) responseImages: ImageResponseDto[];
  @ApiProperty() isComplete: boolean;
}

export class GapResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() index: number;
  @ApiProperty({ type: [String] }) options: string[];
  @ApiProperty() correct: string;
  @ApiProperty() completeSentenceActivityId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class CompleteSentenceActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() question: string;
  @ApiProperty({ type: [String] }) textParts: string[];
  @ApiProperty() stepPosition: number;
  @ApiProperty() solecasAmount: number;
  @ApiProperty() stepId: string;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ type: [GapResponseDto] }) gaps: GapResponseDto[];
  @ApiProperty() isComplete: boolean;
}

export class TrueOrFalseItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() text: string;
  @ApiProperty() isTrue: boolean;
  @ApiProperty() trueOrFalseActivityId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class TrueOrFalseActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() question: string;
  @ApiProperty() stepId: string;
  @ApiProperty() stepPosition: number;
  @ApiProperty() solecasAmount: number;
  @ApiProperty({ nullable: true }) finalTestId: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ type: [TrueOrFalseItemResponseDto] })
  trueOrFalseItems: TrueOrFalseItemResponseDto[];
  @ApiProperty() isComplete: boolean;
}

export class FindAllActivitiesByStepIdResponseDto {
  @ApiProperty({ type: [VideoActivityResponseDto] })
  videoActivities: VideoActivityResponseDto[];
  @ApiProperty({ type: [DialogActivityResponseDto] })
  dialogActivities: DialogActivityResponseDto[];
  @ApiProperty({ type: [MultipleResponseActivityResponseDto] })
  multipleResponseActivities: MultipleResponseActivityResponseDto[];
  @ApiProperty({ type: [ImageActivityResponseDto] })
  imageActivities: ImageActivityResponseDto[];
  @ApiProperty({ type: [CompleteSentenceActivityResponseDto] })
  completeSentenceActivities: CompleteSentenceActivityResponseDto[];
  @ApiProperty({ type: [TrueOrFalseActivityResponseDto] })
  trueOrFalseActivities: TrueOrFalseActivityResponseDto[];
}

export const FindAllActivitiesByStepIdResponses = applyDecorators(
  ApiOkResponse({
    description: "List of all activities by step ID",
    type: FindAllActivitiesByStepIdResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Step not found"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
