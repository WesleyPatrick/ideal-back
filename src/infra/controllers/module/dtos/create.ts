import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsUniqueArray } from "@infra/utils/validate-unique-array";

export class CreateModuleDTO {
  @ApiProperty({
    description: "CUID of the discipline to which this module belongs",
    example: "ckxyz1234567890abcdefghi"
  })
  @IsNotEmpty()
  disciplineId: string;

  @ApiProperty({
    description: "Index of the module within the discipline",
    example: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index: number;

  @ApiProperty({
    description: "Title of the module",
    example: "Introduction to Algebra"
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      "Ordered list of mission titles for this module. Titles must be unique.",
    example: [
      "Mission 1: Basics",
      "Mission 2: Variables",
      "Mission 3: Equations"
    ],
    isArray: true
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsUniqueArray({ message: "Mission names must be unique" })
  missionsTitles: string[];
}
