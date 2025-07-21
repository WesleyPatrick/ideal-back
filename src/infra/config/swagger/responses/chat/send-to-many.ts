import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const SendMessageToManyResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Messages sent successfully"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a user"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Erro"
  })
);
