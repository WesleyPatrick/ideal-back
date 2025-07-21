import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class FindAllServiceProvidersResponseDTO {
  @ApiProperty({
    description: "Service Provider id",
    example: "cvbhxw8c0002xqjufb9d36ry"
  })
  serviceProviderId: string;

  @ApiProperty({
    description: "Service Provider avatar",
    example: "https://example.com/avatar.jpg"
  })
  avatar: string;

  @ApiProperty({ description: "Service Provider name", example: "Pedrao" })
  name: string;

  @ApiProperty({
    description: "Responsible person",
    example: "Service Provider Responsible",
    nullable: true
  })
  responsible?: string;

  @ApiProperty({ description: "Total number of employees", example: 1 })
  employees: number;

  @ApiProperty({ description: "Total Solecas earned", example: 1352 })
  solecas: number;
}

export class PaginatedFindAllServiceProvidersResponseDto {
  @ApiProperty({
    description: "List of service providers",
    type: [FindAllServiceProvidersResponseDTO]
  })
  data: FindAllServiceProvidersResponseDTO[];

  @ApiProperty({ description: "Total number of service providers", example: 1 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last page number", example: 1 })
  lastPage: number;
}

export const FindAllServiceProvidersResponses = applyDecorators(
  ApiOkResponse({
    description: "List of service providers retrieved successfully",
    type: PaginatedFindAllServiceProvidersResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
