import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class UserResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({ description: "User name", example: "John Doe" })
  name: string;

  @ApiProperty({ description: "User CPF", example: "123.456.789-00" })
  cpf: string;

  @ApiProperty({ description: "User email", example: "johndoe@email.com" })
  email: string;

  @ApiProperty({
    description: "User phone number",
    example: "+55 11 99999-9999"
  })
  phone: string;

  @ApiProperty({ description: "User role", example: "ADMIN" })
  role: string;

  @ApiProperty({ description: "User state", example: "São Paulo" })
  state: string;

  @ApiProperty({ description: "User city", example: "São Paulo" })
  city: string;

  @ApiProperty({ description: "User address", example: "Rua Exemplo, 123" })
  address: string;

  @ApiProperty({ description: "User solecas", example: 123 })
  solecas: number;

  @ApiProperty({
    description: "User CNPJ (optional)",
    example: "12.345.678/0001-90",
    nullable: true
  })
  cnpj?: string;

  @ApiProperty({
    description: "Responsible person (optional)",
    example: "Company Owner",
    nullable: true
  })
  responsible?: string;

  @ApiProperty({
    description: "User avatar URL",
    example: "https://example.com/avatar.jpg",
    nullable: true
  })
  avatar?: string;

  @ApiProperty({
    description: "User account creation date",
    example: "2023-01-01T12:00:00.000Z"
  })
  createdAt: Date;

  @ApiProperty({
    description: "User account last update date",
    example: "2023-02-01T15:30:00.000Z"
  })
  updatedAt: Date;
}

export const FindUserResponse = applyDecorators(
  ApiOkResponse({
    description: "User retrieved successfully",
    type: UserResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  })
);
