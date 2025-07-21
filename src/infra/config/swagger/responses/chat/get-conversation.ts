import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { MessageResponseDto } from "./send-to-one";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../error/exception";

export class GetConversationDTO {
  @ApiProperty({
    description: "List of messages",
    type: [MessageResponseDto]
  })
  data: MessageResponseDto[];

  @ApiProperty({ description: "Total number of operators", example: 1 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last page number", example: 1 })
  lastPage: number;
}

export const GetConversationResponses = applyDecorators(
  ApiOkResponse({
    description: "List of messages for that conversation",
    type: GetConversationDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a user"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Erro"
  })
);
