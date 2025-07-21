import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { IsString, IsNumber, IsEmail } from "class-validator";
import { ExceptionResponseDto } from "../../error/exception";

export class UserDetailsResponse {
  @ApiProperty({
    description: "Percentage of steps completed by the user",
    example: 80
  })
  @IsNumber()
  percentageComplete: number;

  @ApiProperty({
    description: "Percentage of activities correct",
    example: 92
  })
  @IsNumber()
  percentageAccurancy: number;

  @ApiProperty({
    description: "User address",
    example: "123 Main St, Springfield, IL"
  })
  @IsString()
  address: string;

  @ApiProperty({ description: "User phone number", example: "+1 555-1234" })
  @IsString()
  phone: string;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com"
  })
  @IsEmail()
  email: string;
}

export const UserDetailsResponses = applyDecorators(
  ApiOkResponse({
    description: "User details",
    type: UserDetailsResponse
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a employee user with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
