import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { Type } from "class-transformer";

export class DisciplineResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  coverImage: string;

  @ApiProperty()
  resume: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedDisciplinesResponseDTO {
  @ApiProperty({ type: [DisciplineResponseDTO] })
  @Type(() => DisciplineResponseDTO)
  data: DisciplineResponseDTO[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  lastPage: number;
}

export const PaginatedDisciplineResponses = applyDecorators(
  ApiOkResponse({
    description: "List of disciplines retrieved successfully",
    type: PaginatedDisciplinesResponseDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
