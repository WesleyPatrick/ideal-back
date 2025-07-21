import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const EmployeeCanAccessFinalTestResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Employee can access final test"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request or employee can't access final test",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a user or mission with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
