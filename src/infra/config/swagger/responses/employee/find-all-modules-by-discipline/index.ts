import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class CardResponseWithoutLastAttemptDto {
  @ApiProperty({
    example: "ckx9ujq0k0000zv2x3x5g7e0p",
    description: "Unique identifier of the module (CUID)"
  })
  moduleId: string;

  @ApiProperty({
    example: "Mathematics",
    description: "Title of the discipline the module belongs to"
  })
  disciplineTitle: string;

  @ApiProperty({
    example: "Module 1: Algebra Basics",
    description: "Name of the module"
  })
  moduleName: string;

  @ApiProperty({
    example: 8,
    description: "Number of missions contained in this module"
  })
  missionsCount: number;

  @ApiProperty({
    example: 80,
    description: "Percentage of completion across all missions in the module"
  })
  completionPercentage: number;

  @ApiProperty({
    example: 92,
    description: "Percentage of correct answers across all completed activities"
  })
  accuracyPercentage: number;
}

export class FindAllEmployeeModulesByDisciplineDTO {
  @ApiProperty({ type: [CardResponseWithoutLastAttemptDto] })
  data: CardResponseWithoutLastAttemptDto[];

  @ApiProperty({ description: "Total number of modules", example: 1 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last available page", example: 1 })
  lastPage: number;
}

export const FindAllEmployeeModulesByDisciplineResponses = applyDecorators(
  ApiOkResponse({
    description:
      "Successfully returned all modules in this discipline by the employee",
    type: FindAllEmployeeModulesByDisciplineDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a discipline or employee"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
