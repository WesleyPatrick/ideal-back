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

export class FindAllServiceProvidersResponseDto {
  @ApiProperty({
    description: "Unique identifier of the service provider",
    example: "cma1d9ci00005jf00btshr7qm"
  })
  id: string;

  @ApiProperty({
    description: "ID of the associated user",
    example: "cm7nu09d10001fwujtpkjbbtx"
  })
  userId: string;

  @ApiProperty({
    description: "ID of the operator to which the service provider belongs",
    example: "cm7nu09d10001fjbnhsadgjtx"
  })
  operatorId: string;

  @ApiProperty({
    description: "Name of the service provider",
    example: "Service Provider User"
  })
  name: string;
}

export const FindAllServicesProvidersByOperatorIdNoPaginationResponse =
  applyDecorators(
    ApiOkResponse({
      description: "List of service providers retrieved successfully",
      type: FindAllServiceProvidersResponseDto,
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
      description: "Not found a operator with this id"
    }),
    ApiInternalServerErrorResponse({
      description: "Internal server error"
    })
  );
