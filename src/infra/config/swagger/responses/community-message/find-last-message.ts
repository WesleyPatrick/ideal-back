import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { IsString, IsDate } from "class-validator";
import { ExceptionResponseDto } from "../error/exception";

export class FindLastMessageResponse {
  @ApiProperty({
    description: "ID of the last community message",
    example: "cmbfiic6c0003jglt33m6jsme"
  })
  @IsString()
  communityMessageId: string;

  @ApiProperty({
    description: "ID of the community ",
    example: "cmbfiic6c0003jglt33m6jome"
  })
  @IsString()
  communityId: string;

  @ApiProperty({
    description: "Name of the community",
    example: "Mathematics Community"
  })
  @IsString()
  communityName: string;

  @ApiProperty({
    description: "Cover image URL of the community",
    example: "https://example.com/images/community-cover.jpg"
  })
  @IsString()
  communityCover: string;

  @ApiProperty({
    description: "Content of the last message",
    example: "Message to community example last"
  })
  @IsString()
  lastMessageContent: string;

  @ApiProperty({
    description: "Author name of the last message",
    example: "Employee Solecas 2"
  })
  @IsString()
  lastMessageAuthorName: string;

  @ApiProperty({
    description: "Datetime when the last message was sent",
    example: "2025-06-02T19:58:17.124Z"
  })
  @IsDate()
  lastMessageDatetime: Date;
}
export class FindLastCommunityMessagesPaginatedResponseDTO {
  @ApiProperty({ type: [FindLastMessageResponse] })
  data: FindLastMessageResponse[];

  @ApiProperty({ example: 1, description: "Current page number" })
  page: number;

  @ApiProperty({ example: 5, description: "Last page number" })
  lastPage: number;

  @ApiProperty({ example: 10, description: "Total number of messages" })
  total: number;
}

export const FindLastCommunityMessageResponses = applyDecorators(
  ApiOkResponse({
    description:
      "Last message sent from that community in which the employee participates",
    type: FindLastCommunityMessagesPaginatedResponseDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a employee with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
