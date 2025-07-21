import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class ProfileResponseDto {
  @ApiProperty({
    description: "Unique identifier of the profile",
    example: "cmae8bbid0005jgxice28m9po"
  })
  id: string;

  @ApiProperty({
    description: "Name of the profile",
    example: "Teste"
  })
  name: string;
}

export const FindProfileByOperatorIdResponses = applyDecorators(
  ApiOkResponse({
    description: "All profiles with the same operatorId",
    type: [ProfileResponseDto]
  }),
  ApiNotFoundResponse({
    description: "Not found operator with this id"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
