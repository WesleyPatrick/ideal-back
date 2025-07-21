import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";
import { DisciplineDto } from "./create";

export class FindDisciplineByIdWithOperatorIdDto extends DisciplineDto {
  @ApiProperty({
    description: "ID da operadora associada",
    example: "cvasfgasdf24513"
  })
  operatorId: string;
}

export const FindDisciplineByIdWithOperatorIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Discipline retrieved successfully",
    type: FindDisciplineByIdWithOperatorIdDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
