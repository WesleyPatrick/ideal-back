import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

export class DiaryMissionDto {
  @ApiProperty({
    description: "Unique identifier of the diary mission (cuid format).",
    example: "cmco6jr9s0001jgp3hjqwhuk2"
  })
  id: string;

  @ApiProperty({
    description: "Date and time when the diary mission starts.",
    example: "2025-07-04T02:13:05.871Z"
  })
  startAt: Date;

  @ApiProperty({
    description: "Date and time when the diary mission ends.",
    example: "2025-08-03T02:13:05.871Z"
  })
  endAt: Date;

  @ApiProperty({
    description:
      "Amount of solecas the user will receive upon completing the diary mission.",
    example: 100
  })
  solecasAmount: number;

  @ApiProperty({
    description:
      "ID of the base mission associated with this diary mission (cuid format).",
    example: "cmco1vu9400g1jg1966bk5zh0"
  })
  missionId: string;

  @ApiProperty({
    description:
      "ID of the user profile associated with this diary mission (cuid format).",
    example: "cmco1vu9s00jbjg19vtxk1z41"
  })
  profileId: string;

  @ApiProperty({
    description: "Date and time when the diary mission was created.",
    example: "2025-07-04T02:13:05.872Z"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date and time when the diary mission was last updated.",
    example: "2025-07-04T02:13:05.872Z"
  })
  updatedAt: Date;
}

export const CreateDiaryMissionResposes = applyDecorators(
  ApiCreatedResponse({
    description: "Diary Mission created successfully",
    type: DiaryMissionDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found mission or profile with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
