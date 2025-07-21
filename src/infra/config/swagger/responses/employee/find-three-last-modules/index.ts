import {
  ApiProperty,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../../error/exception";
import { Type } from "class-transformer";

export class CardResponseDto {
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

  @ApiProperty({
    example: "2025-06-25T14:30:00.000Z",
    description: "Timestamp of the user’s last attempt in this module"
  })
  @Type(() => Date)
  lastAttempt: Date;
}

export const FindThreeLastModulesEmployeeResponses = applyDecorators(
  ApiOkResponse({
    description: "Successfully returned last 3 modules by the employee",
    type: [CardResponseDto]
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a employee"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
