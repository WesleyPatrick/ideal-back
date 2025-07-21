import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiProperty
} from "@nestjs/swagger";
import { MessageResponseDto } from "./send-to-one";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../error/exception";

export class UnreadMessageDTO {
  @ApiProperty({
    description: "Total messages unread"
  })
  totalMessagesUnread: number;

  @ApiProperty({
    description: "Last messages unread",
    type: [MessageResponseDto]
  })
  lastMessages: MessageResponseDto[];
}

export const UnreadMessagesesponses = applyDecorators(
  ApiCreatedResponse({
    description: "Total messages unread and three last messages unread",
    type: UnreadMessageDTO
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
