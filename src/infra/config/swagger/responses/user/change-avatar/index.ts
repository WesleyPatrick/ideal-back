import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const ChangeUserAvatarResponses = applyDecorators(
  ApiNoContentResponse({
    description: "User avatar updated"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a user with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
