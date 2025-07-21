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

class FindOperatorsDto {
  @ApiProperty({
    description: "Unique identifier of the operator",
    example: "cmafm2h3r0001jgtohi819ohc"
  })
  id: string;

  @ApiProperty({
    description: "Name of the operator",
    example: "Operator João"
  })
  name: string;

  @ApiProperty({
    description: "Avatar URL or base64 string of the operator",
    example: "https://example.com/avatar.jpg"
  })
  avatar: string;
}

export class PaginatedOperatorResponseDto {
  @ApiProperty({
    description: "List of operators",
    type: [FindOperatorsDto]
  })
  @Type(() => FindOperatorsDto)
  data: FindOperatorsDto[];

  @ApiProperty({
    description: "Current page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Total number of operators",
    example: 2
  })
  total: number;

  @ApiProperty({
    description: "Last available page",
    example: 1
  })
  lastPage: number;
}

export const FindOperatosByPrizeIdResponses = applyDecorators(
  ApiOkResponse({
    description: "All operators with this prizeId in PrizeOrder",
    type: PaginatedOperatorResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a prize with thisid"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
