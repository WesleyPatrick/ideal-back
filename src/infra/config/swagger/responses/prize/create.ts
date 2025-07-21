import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class PrizeResponseDto {
  @ApiProperty({
    description: "Unique identifier of the prize",
    example: "cma6vqo5b0001s7gi9t3k0mkb"
  })
  id: string;

  @ApiProperty({
    description: "Name of the prize",
    example: "Amazon Gift Card"
  })
  name: string;

  @ApiProperty({
    description: "Number of solecas required to redeem the prize",
    example: 150
  })
  solecasValue: number;

  @ApiProperty({
    description: "Monetary value of the prize",
    example: 75.5
  })
  moneyValue: number;

  @ApiProperty({
    description: "Detailed description of the prize",
    example: "A $75 Amazon gift card redeemable on any purchase."
  })
  description: string;

  @ApiProperty({
    description: "URL of the prize image",
    example: "https://example.com/images/amazon-card.png"
  })
  image: string;

  @ApiProperty({
    description: "Color of the prize card in HEX format",
    example: "#FF5733"
  })
  color: string;

  @ApiProperty({
    description: "Date when the prize offer expires",
    example: "2025-07-31T23:59:59.000Z"
  })
  expiryDate: string;

  @ApiProperty({
    description: "Date when the prize was created",
    example: "2025-05-02T14:19:02.974Z"
  })
  createdAt: string;

  @ApiProperty({
    description: "Date when the prize was last updated",
    example: "2025-05-02T14:19:02.974Z"
  })
  updatedAt: string;
}

export const CreatePrizeResposes = applyDecorators(
  ApiCreatedResponse({
    description: "Prize created successfully",
    type: PrizeResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
