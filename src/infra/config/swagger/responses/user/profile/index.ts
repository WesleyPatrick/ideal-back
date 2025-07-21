import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const UserWithProfileResponses = applyDecorators(
  ApiOkResponse({
    description: "Returns all users plus their job title"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
