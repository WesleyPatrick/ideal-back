import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const SolecasReportResponses = applyDecorators(
  ApiOkResponse({
    description: "Downloads a CSV report with solecas with optional filters"
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
