import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CommunityResponseDto } from "./create";
import { applyDecorators } from "@nestjs/common";

export class PaginatedCommunityResponseDto {
  @ApiProperty({
    type: [CommunityResponseDto],
    description: "List of communities in the current page"
  })
  @Type(() => CommunityResponseDto)
  data: CommunityResponseDto[];

  @ApiProperty({
    example: 1,
    description: "Current page number"
  })
  page: number;

  @ApiProperty({
    example: 1,
    description: "Last available page"
  })
  lastPage: number;

  @ApiProperty({
    example: 1,
    description: "Total number of items"
  })
  total: number;
}

export const FindAllCommunitiesResponses = applyDecorators(
  ApiOkResponse({
    description: "List of communities in the current page",
    type: PaginatedCommunityResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
