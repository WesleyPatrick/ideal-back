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
import { ExceptionResponseDto } from "../../error/exception";

class EmployeeDto {
  @ApiProperty({
    description: "Unique identifier of the employee",
    example: "cmag8kcno0002jfuproc8i6tg"
  })
  id: string;

  @ApiProperty({
    description: "Reference to the associated user",
    example: "cmag8kcnk0000jfup9b53rs4u"
  })
  userId: string;

  @ApiProperty({
    description: "Identifier of the linked service provider",
    example: "cmafofup10002jgpudx7pgekk"
  })
  serviceProviderId: string;

  @ApiProperty({
    description: "Identifier of the assigned profile",
    example: "cmafm2h3w0005jgto3rgr7pkf"
  })
  profileId: string;

  @ApiProperty({
    description: "Timestamp of creation",
    example: "2025-05-09T03:27:58.740Z",
    type: Date
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2025-05-09T03:46:04.728Z",
    type: Date
  })
  @Type(() => Date)
  updatedAt: Date;
}

export class UserWithEmployeeResponseDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "cmag8kcnk0000jfup9b53rs4u"
  })
  id: string;

  @ApiProperty({
    description: "Full name of the user",
    example: "Joaozinho"
  })
  name: string;

  @ApiProperty({
    description: "CPF of the user",
    example: "32162498710"
  })
  cpf: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "joao.silva@email.com"
  })
  email: string;

  @ApiProperty({
    description: "Phone number of the user",
    example: "+5511988888781"
  })
  phone: string;

  @ApiProperty({
    description: "Hashed password of the user",
    example: "$2a$08$FC.EwwrLq1JIjmpjSrsesuIj5.F9k2ER3.aGnS4gLFiuCjbHBno2G"
  })
  password: string;

  @ApiProperty({
    description: "Role assigned to the user",
    example: "EMPLOYEE"
  })
  role: string;

  @ApiProperty({
    description: "State of residence",
    example: "SP"
  })
  state: string;

  @ApiProperty({
    description: "City of residence",
    example: "São Paulo"
  })
  city: string;

  @ApiProperty({
    description: "Full address of the user",
    example: "Rua Augusta, 500"
  })
  address: string;

  @ApiProperty({
    description: "Number of solecas the user has",
    example: 0
  })
  solecas: number;

  @ApiProperty({
    description: "CNPJ if the user is a service provider (null for employee)",
    example: null
  })
  cnpj: string | null;

  @ApiProperty({
    description: "Responsible person name (null for employee)",
    example: null
  })
  responsible: string | null;

  @ApiProperty({
    description: "URL to the user avatar image",
    example: "https://example.com/avatar.jpg"
  })
  avatar: string;

  @ApiProperty({
    description: "Date and time when the user was created",
    example: "2025-05-09T03:27:58.736Z",
    type: Date
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: "Date and time when the user was last updated",
    example: "2025-05-09T03:46:04.728Z",
    type: Date
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: "Employee-related information associated with this user",
    type: EmployeeDto
  })
  @Type(() => EmployeeDto)
  employee: EmployeeDto;
}

export const FindEmployeeByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "User with employee",
    type: UserWithEmployeeResponseDto
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
