import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { DiaryMissionDto } from "../create";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../../error/exception";

export class PaginatedDiaryResponseDTO {
  @ApiProperty({ type: [DiaryMissionDto] })
  @Type(() => DiaryMissionDto)
  data: DiaryMissionDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  lastPage: number;
}

export const FindAllDiaryMissionResposes = applyDecorators(
  ApiOkResponse({
    description: "All the daily missions that the user can still do",
    type: PaginatedDiaryResponseDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found employee user with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
