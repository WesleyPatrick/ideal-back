import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class FindAllOperatorsResponseDto {
  @ApiProperty({
    description: "Operator id",
    example: "cvbhxw8c0002xqjufb9d36ry"
  })
  id: string;

  @ApiProperty({ description: "Operator name", example: "Operator User" })
  name: string;

  @ApiProperty({
    description: "Responsible person",
    example: "Operator Responsible",
    nullable: true
  })
  responsible?: string;

  @ApiProperty({
    description: "Avatar URL",
    example: "https://randomuser.me/api/portraits/men/1.jpg",
    nullable: true
  })
  avatar?: string;

  @ApiProperty({ description: "Total number of service providers", example: 1 })
  serviceProvidersCount: number;

  @ApiProperty({ description: "Total number of employees", example: 1 })
  employeesCount: number;
}

export class PaginatedFindAllOperatorsResponseDto {
  @ApiProperty({
    description: "List of operators",
    type: [FindAllOperatorsResponseDto]
  })
  data: FindAllOperatorsResponseDto[];

  @ApiProperty({ description: "Total number of operators", example: 1 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last page number", example: 1 })
  lastPage: number;
}

export const FindAllOperatorsResponses = applyDecorators(
  ApiOkResponse({
    description: "List of operators retrieved successfully",
    type: PaginatedFindAllOperatorsResponseDto
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
