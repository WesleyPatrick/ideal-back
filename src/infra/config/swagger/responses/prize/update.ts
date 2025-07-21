import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { PrizeResponseDto } from "./create";

export const UpdatePrizeResposes = applyDecorators(
  ApiOkResponse({
    description: "Prize updated successfully",
    type: PrizeResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a prize with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
