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

export class CommunityResponseDto {
  @ApiProperty({
    example: "cmb9gbp460001jgiect1ra8gv",
    description: "CUID of the community"
  })
  id: string;

  @ApiProperty({
    example: "Mathematics Community",
    description: "Name of the community"
  })
  name: string;

  @ApiProperty({
    example: "John Doe",
    description: "Author of the community"
  })
  author: string;

  @ApiProperty({
    example: "A community focused on discussing advanced mathematics topics.",
    description: "Brief summary of the community"
  })
  resume: string;

  @ApiProperty({
    example: "https://example.com/images/community-cover.jpg",
    description: "URL of the community cover image"
  })
  cover: string;

  @ApiProperty({
    example: "cmb88bdyg0040jgrgi69ptzm5",
    description: "CUID of the operator the community belongs to"
  })
  operatorId: string;

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

export const CreateCommunityResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Community created successfully",
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
    description: "Not found a operator with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
