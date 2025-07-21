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

export class ModuleStatisticsDTO {
  @ApiProperty({ example: "cmaoxvavn000bjgqvypqon6tg" })
  id: string;

  @ApiProperty({ example: "Módulo A" })
  moduleName: string;

  @ApiProperty({ example: "Disciplina A" })
  disciplineName: string;

  @ApiProperty({ example: 1 })
  missionCount: number;

  @ApiProperty({ example: 1 })
  stepCount: number;

  @ApiProperty({ example: 1 })
  activitiesCount: number;

  @ApiProperty({
    example: 4,
    description: "Total number of students enrolled in the module"
  })
  studentsCount: number;

  @ApiProperty({ example: 50, description: "Completion rate in percentage" })
  conclusion: number;
}

export const FindModuleByIdWithRelationsResponses = applyDecorators(
  ApiOkResponse({
    type: ModuleStatisticsDTO,
    description: "Module found with relations"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Module not found"
  }),
  ApiForbiddenResponse({
    description: "Forbidden"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
