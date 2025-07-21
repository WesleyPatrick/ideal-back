import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class MissionStatisticsDTO {
  @ApiProperty({ example: "cmapbhxba000djgzwr2tm6ncb" })
  id: string;

  @ApiProperty({ example: "Missão A" })
  missionName: string;

  @ApiProperty({ example: "cmapbhxb8000bjgzw37trfqpc" })
  moduleId: string;

  @ApiProperty({ example: "Módulo A" })
  moduleName: string;

  @ApiProperty({ example: "Disciplina A" })
  disciplineName: string;

  @ApiProperty({
    example: 1,
    description: "Total number of missions in the module"
  })
  missionCount: number;

  @ApiProperty({
    example: 5,
    description: "Total number of steps in the mission"
  })
  stepCount: number;

  @ApiProperty({
    example: 25,
    description: "Total number of activities in the mission"
  })
  activitiesCount: number;

  @ApiProperty({
    example: 4,
    description: "Total number of students in the mission"
  })
  studentsCount: number;

  @ApiProperty({ example: 50, description: "Completion rate in percentage" })
  conclusion: number;
}

export const FindMissionByIdWithRelationsResponses = applyDecorators(
  ApiOkResponse({
    type: MissionStatisticsDTO,
    description: "Mission found with related data"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Mission not found"
  }),
  ApiForbiddenResponse({
    description: "Forbidden"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
