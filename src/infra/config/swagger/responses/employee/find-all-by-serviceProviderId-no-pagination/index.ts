import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";
import { applyDecorators } from "@nestjs/common";

export class FindAllEmployeesResponseDto {
  @ApiProperty({
    description: "Unique identifier of the employee",
    example: "cma1d9ci00005jf00btshr7qm"
  })
  id: string;

  @ApiProperty({
    description: "ID of the associated user",
    example: "cm7nu09d10001fwujtpkjbbtx"
  })
  userId: string;

  @ApiProperty({
    description: "Name of the employee",
    example: "Employee User"
  })
  name: string;
}

export const FindAllEmployeesByServiceProviderIdNoPaginationResponse =
  applyDecorators(
    ApiOkResponse({
      description: "List of employees retrieved successfully",
      type: FindAllEmployeesResponseDto,
      isArray: true
    }),
    ApiBadRequestResponse({
      description: "Invalid request parameters",
      type: ExceptionResponseDto
    }),
    ApiForbiddenResponse({
      description: "User has no permission"
    }),
    ApiNotFoundResponse({
      description: "Not found a service provider with this id"
    }),
    ApiInternalServerErrorResponse({
      description: "Internal server error"
    })
  );
