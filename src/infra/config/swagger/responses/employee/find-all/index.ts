import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class EmployeeResponseDto {
  @ApiProperty({
    description: "Employee ID",
    example: "cabhjw8c0002xqjufb9d36ry"
  })
  employeeId: string;

  @ApiProperty({ description: "Employee name", example: "Employee User" })
  name: string;

  @ApiProperty({
    description: "Employee profile name",
    example: "Doctor"
  })
  profileName: string;

  @ApiProperty({
    description: "Employee avatar URL",
    example: "https://randomuser.me/api/portraits/men/1.jpg",
    nullable: true
  })
  avatar: string | null;

  @ApiProperty({ description: "Total solecas earned", example: 3617 })
  solecas: number;
}

export class FindAllEmployee {
  @ApiProperty({ type: [EmployeeResponseDto] })
  data: EmployeeResponseDto[];

  @ApiProperty({ description: "Total number of employees", example: 1 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Last available page", example: 1 })
  lastPage: number;
}

export const FindAllEmployeesResponse = applyDecorators(
  ApiOkResponse({
    description: "List of employees retrieved successfully",
    type: FindAllEmployee
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
