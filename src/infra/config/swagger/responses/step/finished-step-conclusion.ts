import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const FinishedStepConclusionResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Finished step conclusion"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a step conclusion with these userId and stepId"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
