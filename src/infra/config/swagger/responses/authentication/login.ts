import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class LoginResponseDto {
  @ApiProperty({
    description: "JWT access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  })
  accessToken: string;
}

export const LoginResponses = applyDecorators(
  ApiOkResponse({
    description: "Usuário logado com sucesso",
    type: LoginResponseDto
  }),
  ApiBadRequestResponse({
    description: "Credênciais inválidas",
    type: ExceptionResponseDto
  })
);
