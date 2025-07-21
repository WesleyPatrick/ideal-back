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

export class ModuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  index: number;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  disciplineId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedModulesResponseDto {
  @ApiProperty({ type: [ModuleResponseDto] })
  @Type(() => ModuleResponseDto)
  data: ModuleResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;
}

export const PaginatedModulesResponses = applyDecorators(
  ApiOkResponse({
    description: "List of module retrieved successfully",
    type: PaginatedModulesResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a discipline with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
