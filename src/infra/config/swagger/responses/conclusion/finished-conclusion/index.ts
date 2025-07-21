import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const FinishedConclusionResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Conclusions finished"
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
