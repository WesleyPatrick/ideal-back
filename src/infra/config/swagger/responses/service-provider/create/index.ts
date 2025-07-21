import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class CreateServiceProviderResponseDTO {
  @ApiProperty({
    description: "Service Provider Id",
    example: "cmafoi7op00000cl73cc5cmdb"
  })
  id: string;
}

export const CreateServiceProviderResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Service Provider created successfully",
    type: CreateServiceProviderResponseDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
