import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const CreateProfileResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Profile created successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found discipline, module, mission or step",
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
