import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const CompleteTrueOrFalseActivityResponses = applyDecorators(
  ApiNoContentResponse({
    description: "True or false Activity Complete"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a user or true or false activity with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
