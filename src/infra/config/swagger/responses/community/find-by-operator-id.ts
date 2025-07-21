import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { PaginatedCommunityResponseDto } from "./find-all";

export const FindAllCommunitiesByOperatorIdResponses = applyDecorators(
  ApiOkResponse({
    description: "List of communities by operator id in the current page",
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
