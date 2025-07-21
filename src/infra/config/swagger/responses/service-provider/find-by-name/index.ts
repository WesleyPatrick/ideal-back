import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class FindServiceProviderByNameResponseDto {
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

  @ApiProperty({ description: "Total number of missions", example: 25 })
  missions: number;

  @ApiProperty({ description: "Total Solecas earned", example: 5943 })
  solecas: number;

  @ApiProperty({ description: "Total number of accesses", example: 26 })
  accesses: number;

  @ApiProperty({ description: "Percentage of concluded tasks", example: "58%" })
  concluded: string;
}

export class PaginatedFindServiceProviderByNameResponseDto {
  @ApiProperty({
    description: "List of service providers matching the name",
    type: [FindServiceProviderByNameResponseDto]
  })
  data: FindServiceProviderByNameResponseDto[];

  @ApiProperty({
    description: "Total number of matching service providers",
    example: 1
  })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last page number", example: 1 })
  lastPage: number;
}

export const FindServiceProviderByNameResponses = applyDecorators(
  ApiOkResponse({
    description: "Filtered list of service providers retrieved successfully",
    type: PaginatedFindServiceProviderByNameResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  })
);
