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

class OperatorProfileDto {
  @ApiProperty({ example: "Operadora XYZ" })
  name: string;

  @ApiProperty({ example: "SP" })
  state: string;

  @ApiProperty({ example: "São Paulo" })
  city: string;

  @ApiProperty({ example: "12.345.678/0001-99" })
  cpnj: string;

  @ApiProperty({ example: "Rua Exemplo, 123" })
  address: string;
}

class EmployeeProfileDto {
  @ApiProperty({ example: "João da Silva" })
  name: string;

  @ApiProperty({ example: "123.456.789-00" })
  cpf: string;

  @ApiProperty({ example: "(11) 91234-5678" })
  phone: string;

  @ApiProperty({ example: "joao@email.com" })
  email: string;

  @ApiProperty({ example: "https://example.com/avatar.jpg" })
  avatar: string | null;
}

export class FindEmployeeProfileResponseDto {
  @ApiProperty({ type: OperatorProfileDto })
  operator: OperatorProfileDto;

  @ApiProperty({ type: EmployeeProfileDto })
  employee: EmployeeProfileDto;
}

export const FindEmployeeProfileResponses = applyDecorators(
  ApiOkResponse({
    description: "Employee profile",
    type: FindEmployeeProfileResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a employee with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
