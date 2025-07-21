import { ExceptionResponseDto } from "@infra/config/swagger/responses/error/exception";
import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";

export const UpdateEmployeeResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Employee updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found employee with this id"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
