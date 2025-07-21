import {
  IsOptional,
  IsString,
  ValidateNested,
  ArrayUnique,
  ArrayNotEmpty,
  IsArray
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class EditModuleMissionDto {
  @ApiProperty({
    example: "cm98m01g300000cjy06kr4cfh",
    description: "ID of the mission to be updated"
  })
  @IsString()
  missionId: string;

  @ApiProperty({
    example: "New Mission 1",
    description: "New title to assign to the mission"
  })
  @IsString()
  newMissionTitle: string;
}

export class EditModuleBodyDTO {
  @ApiPropertyOptional({
    example: "Updated Module Title",
    description: "New title to assign to the module (optional)"
  })
  @IsOptional()
  @IsString()
  newModuleTitle?: string;

  @ApiPropertyOptional({
    type: [EditModuleMissionDto],
    description:
      "List of missions to update their titles. Each title must be unique among the provided missions (optional)"
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EditModuleMissionDto)
  @ArrayUnique((mission: EditModuleMissionDto) => mission.newMissionTitle, {
    message: "newMissionTitle must be unique among all missions"
  })
  missions?: EditModuleMissionDto[];
}
