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

class ServiceProviderDto {
  @ApiProperty({
    description: "Unique identifier of the service provider record",
    example: "cmafofup10002jgpudx7pgekk"
  })
  id: string;

  @ApiProperty({
    description: "Reference to the associated user",
    example: "cmafofuow0000jgpuuls5dweb"
  })
  userId: string;

  @ApiProperty({
    description: "Identifier of the linked operator",
    example: "cmafmmvxq0002jgiwpb8pjq74"
  })
  operatorId: string;

  @ApiProperty({
    description: "Timestamp of creation",
    example: "2025-05-08T18:04:36.518Z",
    type: Date
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2025-05-08T18:04:36.518Z",
    type: Date
  })
  @Type(() => Date)
  updatedAt: Date;
}

export class UserWithServiceProviderResponseDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "cmafofuow0000jgpuuls5dweb"
  })
  id: string;

  @ApiProperty({
    description: "Full name of the user",
    example: "WebPrestadora Teste"
  })
  name: string;

  @ApiProperty({ description: "CPF of the user", example: "32165498708" })
  cpf: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "providerJ@example.com.br"
  })
  email: string;

  @ApiProperty({
    description: "Phone number of the user",
    example: "+5511988888888"
  })
  phone: string;

  @ApiProperty({ description: "Hashed password of the user", example: "..." })
  password: string;

  @ApiProperty({
    description: "Role assigned to the user",
    example: "SERVICE_PROVIDER"
  })
  role: string;

  @ApiProperty({ description: "State of residence", example: "SP" })
  state: string;

  @ApiProperty({ description: "City of residence", example: "São Paulo" })
  city: string;

  @ApiProperty({
    description: "Full address of the user",
    example: "Rua Augusta, 500"
  })
  address: string;

  @ApiProperty({ description: "Number of solecas the user has", example: 0 })
  solecas: number;

  @ApiProperty({
    description: "CNPJ of the service provider",
    example: "12345678000191"
  })
  cnpj: string;

  @ApiProperty({
    description: "Responsible person name",
    example: "Service Provider Responsible"
  })
  responsible: string;

  @ApiProperty({
    description: "URL to the user avatar image",
    example: "https://randomuser.me/api/portraits/men/1.jpg"
  })
  avatar: string;

  @ApiProperty({
    description: "Date and time when the user was created",
    example: "2025-05-08T18:04:36.513Z",
    type: Date
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: "Date and time when the user was last updated",
    example: "2025-05-08T18:27:46.408Z",
    type: Date
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description:
      "Service provider-related information associated with this user",
    type: ServiceProviderDto
  })
  @Type(() => ServiceProviderDto)
  serviceProvider: ServiceProviderDto;
}

export const FindServiceProviderByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "User with service provider",
    type: UserWithServiceProviderResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a service provider with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
