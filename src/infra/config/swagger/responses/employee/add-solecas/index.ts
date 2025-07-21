import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class AddEmployeeSolecasDTO {
  @ApiProperty({
    description: "New employee solecas value",
    example: "cmcntsyu40000c6jg6ayzhds7"
  })
  solecasValueUpdated: number;
}

export const AddEmployeeSolecasResponses = applyDecorators(
  ApiOkResponse({
    description: "Employee Solecas Updated",
    type: AddEmployeeSolecasDTO
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
