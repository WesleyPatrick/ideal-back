import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

class DisciplineResponseDTO {
  @ApiProperty({
    description: "Id of the discipline",
    example: "cm97odqpn000411p4gg69kfbv"
  })
  disciplineId: string;

  @ApiProperty({
    description: "Name of the discipline",
    example: "Mathematics"
  })
  disciplineName: string;
}

export const FindDisciplinesByOperatorIdNoPaginationResponse = applyDecorators(
  ApiOkResponse({
    description: "List of disciplines retrieved successfully",
    type: [DisciplineResponseDTO]
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Operator not found"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
