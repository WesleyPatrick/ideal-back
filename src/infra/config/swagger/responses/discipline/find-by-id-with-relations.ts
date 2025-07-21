import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class MissionDTO {
  @ApiProperty({
    description: "Mission ID",
    example: "cm97odqpn000411p4gg69kfbv"
  })
  id: string;

  @ApiProperty({
    description: "Title of the mission",
    example: "Mission 1: Basics"
  })
  title: string;

  @ApiProperty({ description: "Index of the mission", example: 0 })
  index: number;
}

export class ModuleDTO {
  @ApiProperty({
    description: "Module ID",
    example: "cm97odqpa000211p42c9v4ooq"
  })
  id: string;

  @ApiProperty({
    description: "Title of the module",
    example: "Introduction to Algebra"
  })
  title: string;

  @ApiProperty({ description: "Index of the module", example: 0 })
  index: number;

  @ApiProperty({ type: [MissionDTO], description: "List of missions" })
  missions: MissionDTO[];
}

export class DisciplineWithModulesDTO {
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
    description: "Resume of the discipline",
    example: "The resume"
  })
  resume: string;

  @ApiProperty({
    description: "Cover image URL",
    example: "https://example.com/image.jpg"
  })
  coverImage: string;

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

  @ApiProperty({ type: [ModuleDTO], description: "List of modules" })
  modules: ModuleDTO[];
}

export const DisciplineWithRelationsResponses = applyDecorators(
  ApiOkResponse({
    description: "Discipline with modules and missions retrieved successfully",
    type: DisciplineWithModulesDTO
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a discipline with this relations"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  })
);
