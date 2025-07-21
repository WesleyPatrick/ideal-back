import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const CreateEmployeeResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Employee created successfully"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found Service Provider or Profile with these IDs"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
