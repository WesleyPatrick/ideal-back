import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { DisciplineDto } from "./create";
import { applyDecorators } from "@nestjs/common";

export const EditDisciplineResponses = applyDecorators(
  ApiOkResponse({
    description: "Discipline edited successfully",
    type: DisciplineDto
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
