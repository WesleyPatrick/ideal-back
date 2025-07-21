import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class FindAllOperatorsDTO {
  @ApiProperty({
    description: "Operator Id",
    example: "cmafno8tn00020cl4hwnvfplt"
  })
  id: string;

  @ApiProperty({
    description: "User Id",
    example: "cmafno8tn00020cl4h2nvfplt"
  })
  userId: string;

  @ApiProperty({
    description: "Operator name",
    example: "John Doe"
  })
  name: string;
}

export const FindAllOperatorNoPaginationResponses = applyDecorators(
  ApiOkResponse({
    description: "List of operators retrieved successfully",
    type: [FindAllOperatorsDTO]
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
