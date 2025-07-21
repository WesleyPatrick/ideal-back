import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";

export class FindAllPrizeOrderResponseDto {
  @ApiProperty({
    description: "Unique identifier of the prize",
    example: "cmah4hegq0000jf8hgh20pbgm"
  })
  id: string;

  @ApiProperty({
    description: "Name of the prize",
    example: "Amazon Gift Teste"
  })
  name: string;

  @ApiProperty({
    description: "Current Solecas value of the prize",
    example: 125
  })
  solecasValue: number;

  @ApiProperty({
    description: "Current money value of the prize",
    example: 750
  })
  moneyValue: number;

  @ApiProperty({
    description: "Textual description of the prize",
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
    description: "Expiration date of the prize",
    example: "2025-12-30T23:59:59.000Z"
  })
  expiryDate: Date;

  @ApiProperty({
    description: "Creation timestamp of the prize record",
    example: "2025-05-09T18:21:28.825Z"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last updated timestamp of the prize record",
    example: "2025-05-09T18:36:12.096Z"
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Total number of times this prize has been sold",
    example: 3
  })
  soldCount: number;

  @ApiProperty({
    description: "Total amount of money spent to redeem this prize",
    example: 901
  })
  totalMoneyValue: number;

  @ApiProperty({
    description: "Total amount of Solecas spent to redeem this prize",
    example: 425
  })
  totalSolecasUsed: number;
}

export class PaginatedFindAllPrizeOrderResponseDto {
  @ApiProperty({
    description: "List of prizes sold with aggregated sales data",
    type: [FindAllPrizeOrderResponseDto]
  })
  data: FindAllPrizeOrderResponseDto[];

  @ApiProperty({
    description: "Current page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Total number of sold prize records available",
    example: 1
  })
  total: number;

  @ApiProperty({
    description: "Last page number based on total and page size",
    example: 1
  })
  lastPage: number;
}

export const FindAllPrizeOrderResponses = applyDecorators(
  ApiOkResponse({
    description: "List of all redeemed prizes",
    type: PaginatedFindAllPrizeOrderResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
