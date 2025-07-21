import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { IsString, IsUrl, IsInt } from "class-validator";
import { ExceptionResponseDto } from "../../error/exception";

export class UserRankingDto {
  @ApiProperty({
    description: "User unique identifier",
    example: "ckv1c3l0x0000bqz4jzph3e3r"
  })
  @IsString()
  userId: string;

  @ApiProperty({ description: "User name", example: "John Doe" })
  @IsString()
  userName: string;

  @ApiProperty({
    description: "URL of the user avatar",
    example: "https://example.com/avatar.jpg"
  })
  @IsUrl()
  userAvatar: string;

  @ApiProperty({
    description: "Name of the associated service provider",
    example: "Modern Chemistry Lab"
  })
  @IsString()
  serviceProviderName: string;

  @ApiProperty({ description: "Number of concluded missions", example: 15 })
  @IsInt()
  missionConclusionCount: number;

  @ApiProperty({
    description: "Amount of solecas collected by the user",
    example: 320
  })
  @IsInt()
  userSolecas: number;
}

export const RankingResponses = applyDecorators(
  ApiOkResponse({
    description: "Return TOP 3 employees ranking by mission conclusion count",
    type: [UserRankingDto]
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
