import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const ActiveUsersReportResponses = applyDecorators(
  ApiOkResponse({
    description:
      "Downloads a CSV report with active users based on the selected operator and optional filters"
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User does not have permission to access this resource"
  }),
  ApiNotFoundResponse({
    description: "Operator, service provider, or employee not found"
  }),
  ApiInternalServerErrorResponse({
    description: "Unexpected internal server error"
  })
);
