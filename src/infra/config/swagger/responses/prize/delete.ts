import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";

export const DeletePrizeResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Prize deleted successfully"
  }),
  ApiBadRequestResponse({
    description: "Invalid Request"
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
