import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const UpdateServiceProviderResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Service Provider updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found service provider with this id",
    type: ExceptionResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error",
    type: ExceptionResponseDto
  })
);
