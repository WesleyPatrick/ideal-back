import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { IsUniqueArray } from "@infra/utils/validate-unique-array";

export class CreateDisciplineDTO {
  @ApiProperty({
    description: "Title of the discipline",
    example: "Mathematics Basics"
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Author of the discipline",
    example: "John Doe"
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: "Short resume or summary of the discipline",
    example:
      "This discipline covers basic mathematical concepts including algebra, geometry, and arithmetic."
  })
  @IsString()
  @IsNotEmpty()
  resume: string;

  @ApiProperty({
    description: "Title of the module associated with the discipline",
    example: "Module 1: Introduction"
  })
  @IsString()
  @IsNotEmpty()
  moduleTitle: string;

  @ApiProperty({
    description: "Operator id",
    example: "clm5r44spb10008l46l1f88sc"
  })
  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @ApiProperty({
    description: "List of mission names associated with the discipline",
    example: ["Mission 1", "Mission 2", "Mission 3"],
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUniqueArray({ message: "Mission names must be unique" })
  @Type(() => String)
  missionTitles: string[];
}
