import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import {
  VideoActivityResponseDto,
  DialogActivityResponseDto,
  MultipleResponseActivityResponseDto,
  ImageActivityResponseDto,
  CompleteSentenceActivityResponseDto,
  TrueOrFalseActivityResponseDto
} from "../../step/find-all-activities-in-step";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../../error/exception";

export class FindAllActivitisInFinalTestDTO {
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

export const FindAllActivitisInFinalTestResponses = applyDecorators(
  ApiOkResponse({
    description: "All activities in final test",
    type: FindAllActivitisInFinalTestDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a final test with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
