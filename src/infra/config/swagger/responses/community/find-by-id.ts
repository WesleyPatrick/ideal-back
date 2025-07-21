import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { CommunityResponseDto } from "./create";

export const FindCommunityByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Return community",
    type: CommunityResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a community with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
