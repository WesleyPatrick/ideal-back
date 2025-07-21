import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const CompleteSenteceActivityResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Sentence Activity Complete"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a user or sentence activity with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
