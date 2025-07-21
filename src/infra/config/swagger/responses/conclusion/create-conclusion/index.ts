import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const CreateConclusionResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Conclusions created"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a entity"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
