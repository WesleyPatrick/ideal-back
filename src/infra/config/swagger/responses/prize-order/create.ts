import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { applyDecorators } from "@nestjs/common";

export class RedeemedPrizeResponseDto {
  @ApiProperty({
    description: "Unique identifier of the redeemed prize record",
    example: "cmabxc02h0003jf4rkvth5ios"
  })
  id: string;

  @ApiProperty({
    description: "Unique identifier of the prize",
    example: "cmabwu0y80000jf637ym4h45l"
  })
  prizeId: string;

  @ApiProperty({
    description: "Unique identifier of the employee who redeemed the prize",
    example: "cmabw683l0005jf4frdo06kgy"
  })
  employeeId: string;

  @ApiProperty({
    description:
      "Unique identifier of the service provider linked to the employee",
    example: "cmabw683i0003jf4fmh40dssj"
  })
  serviceProviderId: string;

  @ApiProperty({
    description:
      "Unique identifier of the operator linked to the service provider",
    example: "cmabw683f0001jf4f282ogkpg"
  })
  operatorId: string;

  @ApiProperty({
    description: "Number of solecas spent to redeem the prize",
    example: 150
  })
  solecasValue: number;

  @ApiProperty({
    description: "Monetary value of the prize in BRL",
    example: 75.5
  })
  moneyValue: number;

  @ApiProperty({
    description: "Remaining solecas of the employee after the redemption",
    example: 8550
  })
  solecasRemaining: number;

  @ApiProperty({
    description:
      "Date and time when the redemption was created (ISO 8601 format)",
    example: "2025-05-06T03:02:28.697Z"
  })
  createdAt: string;

  @ApiProperty({
    description:
      "Date and time when the redemption record was last updated (ISO 8601 format)",
    example: "2025-05-06T03:02:28.697Z"
  })
  updatedAt: string;
}

export const CreatePrizeOrderResposes = applyDecorators(
  ApiCreatedResponse({
    description: "Prize Order created successfully",
    type: RedeemedPrizeResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a resource"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
