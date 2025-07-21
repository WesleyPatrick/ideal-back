import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class OperatorResponseDto {
  @ApiProperty({
    description: "Operator ID",
    example: "cm829xw8c0002xqjufb9d36ry"
  })
  id: string;

  @ApiProperty({ description: "Operator name", example: "Operator User" })
  name: string;

  @ApiProperty({
    description: "Operator email",
    example: "operator@example.com.br"
  })
  email: string;

  @ApiProperty({
    description: "Operator phone number",
    example: "+5511988888888"
  })
  phone: string;

  @ApiProperty({ description: "Operator address", example: "Rua Augusta, 500" })
  address: string;

  @ApiProperty({ description: "State", example: "São Paulo" })
  state: string;

  @ApiProperty({ description: "City", example: "São Paulo" })
  city: string;

  @ApiProperty({
    description: "CNPJ",
    example: "12.345.678/0001-99",
    nullable: true
  })
  cnpj?: string;

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

  @ApiProperty({
    description: "Date of creation",
    example: "2025-03-09T23:38:19.113Z"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date of last update",
    example: "2025-03-09T23:38:19.113Z"
  })
  updatedAt: Date;

  @ApiProperty({ description: "Total number of service providers", example: 1 })
  serviceProvidersCount: number;

  @ApiProperty({ description: "Total number of employees", example: 1 })
  employeesCount: number;

  @ApiProperty({ description: "Formation progress", example: "7%" })
  formation: number;
}

export const FindOperatorByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Operator details retrieved successfully",
    type: OperatorResponseDto
  }),
  ApiBadRequestResponse({
    description: "Operator not found or invalid request",
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
