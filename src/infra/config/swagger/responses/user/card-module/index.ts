import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { IsString, IsInt, IsNumber } from "class-validator";
import { ExceptionResponseDto } from "../../error/exception";

export class CardModuleResponse {
  @ApiProperty({
    description: "Name of the module",
    example: "Financial Education - Module 1"
  })
  @IsString()
  moduleName: string;

  @ApiProperty({
    description: "Total number of missions included in this module",
    example: 8
  })
  @IsInt()
  missionsCount: number;

  @ApiProperty({
    description: "Percentage of users who have completed this module",
    example: 42.5
  })
  @IsNumber()
  percentageComplete: number;

  @ApiProperty({
    description:
      "Percentage of users who answered the module's activities correctly",
    example: 68.7
  })
  @IsNumber()
  percentageAccurancy: number;
}

export const CardModuleResponses = applyDecorators(
  ApiOkResponse({
    description:
      "Return information about the last two modules that had activities completed",
    type: [CardModuleResponse]
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Resource not found"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
