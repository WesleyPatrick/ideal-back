import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class DisciplineDto {
  @ApiProperty({
    description: "Discipline ID",
    example: "cm92m37rk00018a7an36l8fml"
  })
  id: string;

  @ApiProperty({
    description: "Title of the discipline",
    example: "Mathematics"
  })
  title: string;

  @ApiProperty({ description: "Author of the discipline", example: "John" })
  author: string;

  @ApiProperty({
    description: "Cover image URL",
    example: "https://example.com/image.jpg"
  })
  coverImage: string;

  @ApiProperty({
    description: "Resume of the discipline",
    example: "The resume"
  })
  resume: string;

  @ApiProperty({
    description: "Discipline Color",
    example: "#2B95F6"
  })
  color: string;

  @ApiProperty({
    description: "Creation date",
    example: new Date().toISOString()
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update date",
    example: new Date().toISOString()
  })
  updatedAt: Date;
}

export class CreateDisciplineResponseDto {
  @ApiProperty({ type: () => DisciplineDto })
  discipline: DisciplineDto;

  @ApiProperty({
    description: "Title of the created module",
    example: "Module 1: Introduction"
  })
  moduleTitle: string;

  @ApiProperty({
    description: "Titles of the created missions",
    type: [String],
    example: ["Mission 1", "Mission 2", "Mission 3"]
  })
  missionTitles: string[];
}

export const CreateDisciplineResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Discipline created successfully",
    type: CreateDisciplineResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  })
);
