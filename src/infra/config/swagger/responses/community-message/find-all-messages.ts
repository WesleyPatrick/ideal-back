import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class CommunityMessageItemDTO {
  @ApiProperty({
    example: "cmbgjbbj00003jg91b5pveddu",
    description: "Unique message ID"
  })
  id: string;

  @ApiProperty({
    example: "cmb9woi1h0003jgd0hj1l75dn",
    description: "ID of the community"
  })
  communityId: string;

  @ApiProperty({
    example: "Message to community example last message",
    description: "Content of the message"
  })
  content: string;

  @ApiProperty({
    example: "cmb88bdyh0044jgrg1tdkmaa1",
    description: "User ID of the sender "
  })
  fromUserId: string;

  @ApiProperty({
    example: "test.png",
    description: "Avatar URL of the sender, if available",
    nullable: true
  })
  fromUserAvatar: string | null;

  @ApiProperty({
    example: "Employee Solecas 2",
    description: "Name of the sender"
  })
  fromUserName: string;

  @ApiProperty({
    example: null,
    description: "Date and time the message was read",
    nullable: true
  })
  readAt: string | null;

  @ApiProperty({
    example: "2025-06-03T13:08:35.485Z",
    description: "Date and time the message was created"
  })
  createdAt: string;

  @ApiProperty({
    example: "2025-06-03T13:08:35.485Z",
    description: "Date and time the message was last updated"
  })
  updatedAt: string;
}

export class CommunityMessagesPaginatedResponseDTO {
  @ApiProperty({ type: [CommunityMessageItemDTO] })
  data: CommunityMessageItemDTO[];

  @ApiProperty({ example: 1, description: "Current page number" })
  page: number;

  @ApiProperty({ example: 5, description: "Last page number" })
  lastPage: number;

  @ApiProperty({ example: 10, description: "Total number of messages" })
  total: number;
}

export const FindAllCommunityMessagesResponses = applyDecorators(
  ApiOkResponse({
    description: "All messages from this community",
    type: CommunityMessagesPaginatedResponseDTO
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
