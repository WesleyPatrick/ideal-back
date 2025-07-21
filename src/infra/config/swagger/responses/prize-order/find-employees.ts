import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExceptionResponseDto } from "../error/exception";

class EmployeePrizeUsageDto {
  @ApiProperty({
    description: "Unique identifier of the employee",
    example: "cmafm2h3x0007jgtowxh7s194"
  })
  id: string;

  @ApiProperty({
    description: "Name of the employee",
    example: "Employee User"
  })
  name: string;

  @ApiProperty({
    description: "Avatar URL of the employee. Can be null if not set",
    example: "https://example.com/avatar.png",
    nullable: true
  })
  avatar: string | null;

  @ApiProperty({
    description: "Current available solecas of the employee",
    example: 9700
  })
  currentSolecas: number;

  @ApiProperty({
    description: "Total solecas used by the employee for the prize",
    example: 300
  })
  solecasUsed: number;
}

export class PaginatedEmployeePrizeUsageResponseDto {
  @ApiProperty({
    description: "List of employees with their current and used solecas",
    type: [EmployeePrizeUsageDto]
  })
  @Type(() => EmployeePrizeUsageDto)
  data: EmployeePrizeUsageDto[];

  @ApiProperty({
    description: "Current page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Last available page number",
    example: 1
  })
  lastPage: number;

  @ApiProperty({
    description: "Total number of employees found",
    example: 1
  })
  total: number;
}

export const FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdResponses =
  applyDecorators(
    ApiOkResponse({
      description:
        "All employees with this prizeId and operatorId and serviceProviderId in PrizeOrder",
      type: PaginatedEmployeePrizeUsageResponseDto
    }),
    ApiBadRequestResponse({
      description: "Invalid Request",
      type: ExceptionResponseDto
    }),
    ApiNotFoundResponse({
      description: "Not found a prize or operator with this ids"
    }),
    ApiForbiddenResponse({
      description: "User has no permission"
    }),
    ApiInternalServerErrorResponse({
      description: "Internal Server Error"
    })
  );
