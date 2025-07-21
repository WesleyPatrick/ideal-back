import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";
import { UserResponseDto } from "../find";

export const UpdateUserByUserResponses = applyDecorators(
  ApiOkResponse({
    description: "User updated successfully",
    type: UserResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found user with this id"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
