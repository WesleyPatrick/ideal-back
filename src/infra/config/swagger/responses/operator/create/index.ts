import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export const CreateOperatorResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Operator created successfully"
  }),
  ApiBadRequestResponse({
    description: "Invalid arguments",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
