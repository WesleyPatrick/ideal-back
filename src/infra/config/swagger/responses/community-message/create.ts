import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExceptionResponseDto } from "../error/exception";

export class CommunityMessageResponseDto {
  @ApiProperty({
    description: "Unique identifier of the message (CUID format)",
    example: "cmb9woi1h0003jgd0hj1l75dn"
  })
  id: string;

  @ApiProperty({
    description:
      "Unique identifier of the user who sent the message (CUID format)",
    example: "cmb88bdyh0044jgrg1tdkmaa1"
  })
  fromUserId: string;

  @ApiProperty({
    description:
      "Unique identifier of the community where the message was sent (CUID format)",
    example: "cmb9woi1h0003jgd0hj1l75dn"
  })
  communityId: string;

  @ApiProperty({
    description: "Content of the message",
    example: "Message to community example"
  })
  content: string;

  @ApiProperty({
    description:
      "URL or filename of the avatar of the user who sent the message",
    example: "avatar-test.png"
  })
  fromUserAvatar: string;

  @ApiProperty({
    description: "Name of the user who sent the message",
    example: "Employee Solecas 2"
  })
  fromUserName: string;

  @ApiProperty({
    example: "2025-05-29T14:10:31.015Z",
    description: "Date when the community was created"
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: "2025-05-29T14:10:31.015Z",
    description: "Date when the community was last updated"
  })
  @Type(() => Date)
  updatedAt: Date;
}

export const CreateCommunityMessageResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Community message send successfully",
    type: CommunityMessageResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a user or community with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
