import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExceptionResponseDto } from "../../error/exception";

export class StepAccessDto {
  @ApiProperty({
    example: "cmbt0reeo0081jf5rdvz73flg",
    description: "Unique identifier of the step"
  })
  stepId: string;

  @ApiProperty({
    example: 0,
    description: "Index of the step inside the mission"
  })
  stepIndex: number;

  @ApiProperty({
    example: true,
    description: "Indicates if the step is fully completed"
  })
  isCompleted: boolean;

  @ApiProperty({
    example: 3,
    description: "Total number of correct activities in the step"
  })
  activitiesCorrect: number;

  @ApiProperty({
    example: 1,
    description: "Total number of incorrect activities in the step"
  })
  activitiesIncorrect: number;
}

export class FindDailyMissionTrailDto {
  @ApiProperty({
    example: "cmcuth8f1000207k16cn78c06",
    description: "Unique identifier of the daily mission"
  })
  dailyMissionId: string;

  @ApiProperty({
    example: "cmcj41u5u0003tfjh8xhl7rix",
    description: "Id of the mission"
  })
  missionId: string;

  @ApiProperty({
    example: 0,
    description: "Index of the mission within the daily sequence"
  })
  missionIndex: number;

  @ApiProperty({
    example: "Missão Diária A",
    description: "Title or name of the daily mission"
  })
  missionName: string;

  @ApiProperty({
    example: "https://video.com/videoA.mp4",
    nullable: true,
    description: "URL to the mission introduction video (optional)"
  })
  missionVideoUrl: string | null;

  @ApiProperty({
    example: "cmcuthhj2000307k1hzszhaqv",
    nullable: true,
    description: "Optional reference to a dialog activity in the mission"
  })
  missionDialogActivityId: string | null;

  @ApiProperty({
    example: "articleA.pdf",
    description:
      "Filename or URL of the article file associated with the mission"
  })
  missionArticleFile: string;

  @ApiProperty({
    type: [StepAccessDto],
    description: "List of steps within the mission"
  })
  @Type(() => StepAccessDto)
  steps: StepAccessDto[];
}

export const FindDailyMissionTrailResponses = applyDecorators(
  ApiOkResponse({
    description: "All the daily missions that the user can still do",
    type: FindDailyMissionTrailDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found employee user or daily mission with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
