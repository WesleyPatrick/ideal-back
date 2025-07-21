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

export class FindEmployeeProgressDTO {
  @ApiProperty({
    description: "Employee Progress"
  })
  progress: number;
}

export const FindEmployeeProgressResponses = applyDecorators(
  ApiOkResponse({
    description: "Return employee progress",
    type: FindEmployeeProgressDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found employee with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
