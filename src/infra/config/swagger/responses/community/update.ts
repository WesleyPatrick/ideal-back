import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { CommunityResponseDto } from "./create";

export const UpdateCommunityResponses = applyDecorators(
  ApiOkResponse({
    description: "Community updated successfully",
    type: CommunityResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a community with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
