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
import { ExceptionResponseDto } from "../error/exception";

export class StepResumeDto {
  @ApiProperty({
    description: "CUID identifier of the step",
    example: "ckxv7z0x00000gk8xzgzq0v4t"
  })
  id: string;

  @ApiProperty({
    description: "Title of the step",
    example: "Introduction to hygiene procedures"
  })
  title: string;

  @ApiProperty({
    description: "Order index of the step within the mission",
    example: 0
  })
  index: number;
}

export class MissionsAndStepsByModuleIdResponseDto {
  @ApiProperty({
    description: "CUID identifier of the mission",
    example: "ckxv7z0x00000gk8xzgzq0v4t"
  })
  id: string;

  @ApiProperty({
    description: "Title of the mission",
    example: "Mission: Basic Sanitation"
  })
  title: string;

  @ApiProperty({
    description: "Order index of the mission within the module",
    example: 0
  })
  index: number;

  @ApiProperty({
    type: [StepResumeDto],
    description: "List of steps associated with the mission"
  })
  @Type(() => StepResumeDto)
  steps: StepResumeDto[];
}

export class PaginatedMissionsAndStepsByModuleIdResponseDto {
  @ApiProperty({ type: [MissionsAndStepsByModuleIdResponseDto] })
  @Type(() => MissionsAndStepsByModuleIdResponseDto)
  data: MissionsAndStepsByModuleIdResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;
}

export const FindAllMissionsAndStepsByModuleIdResponses = applyDecorators(
  ApiOkResponse({
    description: "List of missions with steps retrieved successfully",
    type: PaginatedMissionsAndStepsByModuleIdResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a module with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
