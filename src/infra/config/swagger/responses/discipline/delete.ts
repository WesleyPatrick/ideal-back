import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const DeleteDisciplineResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Discipline deleted successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found a discipline with this id"
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  })
);
