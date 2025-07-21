import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { ProfileResponseDto } from "./find-by-operatorId-no-pagination";

export const FindProfileByMissionIdResponses = applyDecorators(
  ApiOkResponse({
    description: "All profiles with the same missionId",
    type: [ProfileResponseDto]
  }),
  ApiNotFoundResponse({
    description: "Not found operator with this id"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
