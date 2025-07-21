import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { PrizeResponseDto } from "./create";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../error/exception";

export class PaginatedPrizeResponseDto {
  @ApiProperty({ type: [PrizeResponseDto] })
  data: PrizeResponseDto[];

  @ApiProperty({
    description: "Current page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Last page number available",
    example: 1
  })
  lastPage: number;

  @ApiProperty({
    description: "Total number of items",
    example: 2
  })
  total: number;
}

export const FindAllPrizesResponses = applyDecorators(
  ApiOkResponse({
    description: "List of prizes retrieved successfully",
    type: PaginatedPrizeResponseDto
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
