import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExceptionResponseDto } from "../error/exception";

class ServicesProvidersByPrizeIdAndOperatorIdDTO {
  @ApiProperty({
    description: "Unique identifier of the service provider",
    example: "cmafm2h3u0003jgto8ciuzixa"
  })
  id: string;

  @ApiProperty({
    description: "Name of the service provider",
    example: "Service Provider User"
  })
  name: string;

  @ApiProperty({
    description: "Avatar URL of the service provider. Can be null if not set",
    example: "https://randomuser.me/api/portraits/men/1.jpg",
    nullable: true
  })
  avatar: string | null;

  @ApiProperty({
    description: "Responsible person for the service provider",
    example: "Service Provider Responsible"
  })
  responsible: string;
}

export class PaginatedServiceProviderResponseDto {
  @ApiProperty({
    description: "List of service providers",
    type: [ServicesProvidersByPrizeIdAndOperatorIdDTO]
  })
  @Type(() => ServicesProvidersByPrizeIdAndOperatorIdDTO)
  data: ServicesProvidersByPrizeIdAndOperatorIdDTO[];

  @ApiProperty({
    description: "Current page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Last page number available",
    example: 1
  })
  lastPage: number;

  @ApiProperty({
    description: "Total number of unique service providers",
    example: 2
  })
  total: number;
}

export const FindServicesProvidersByPrizeIdAndOperatorIdResponses =
  applyDecorators(
    ApiOkResponse({
      description:
        "All services providers with this prizeId and operatorId in PrizeOrder",
      type: PaginatedServiceProviderResponseDto
    }),
    ApiBadRequestResponse({
      description: "Invalid Request",
      type: ExceptionResponseDto
    }),
    ApiNotFoundResponse({
      description: "Not found a prize or operator with this ids"
    }),
    ApiForbiddenResponse({
      description: "User has no permission"
    }),
    ApiInternalServerErrorResponse({
      description: "Internal Server Error"
    })
  );
