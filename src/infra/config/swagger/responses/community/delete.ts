import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const DeleteCommunityResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Community deleted successfully"
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
