import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export const GetFilePresignedUrlResponses = applyDecorators(
  ApiOkResponse({
    description: "Return file presigned url with success!"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "File not found"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
