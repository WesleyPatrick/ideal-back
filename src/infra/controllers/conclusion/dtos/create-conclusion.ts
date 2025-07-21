import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsInt
} from "class-validator";
import { Type } from "class-transformer";

class FinalTestDto {
  @ApiProperty({
    description:
      "Number of activities the user answered correctly in the final test",
    example: 5
  })
  @IsInt()
  activitiesHit: number;

  @ApiProperty({
    description: "ID of the final test to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsString()
  @IsNotEmpty()
  finalTestId: string;
}

export class CreateConclusionDTO {
  @ApiProperty({
    description: "ID of the user to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: "ID of the discipline to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  disciplineId?: string;

  @ApiPropertyOptional({
    description: "ID of the module to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  moduleId?: string;

  @ApiPropertyOptional({
    description: "ID of the mission to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  missionId?: string;

  @ApiPropertyOptional({
    description: "ID of the step to be used for conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  stepId?: string;

  @ApiPropertyOptional({
    description: "ID of the daily mission step to be used for conclusion",
    example: "cmcux4p9d000207l506wmc6r8"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  stepDailyMissionId?: string;

  @ApiPropertyOptional({
    description: "ID of the daily mission to be used for conclusion",
    example: "cmcux4l5n000107l5e2p90zpu"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dailyMissionId?: string;

  @ApiPropertyOptional({
    description: "Information about the final test to be used for conclusion",
    type: () => FinalTestDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FinalTestDto)
  finalTest?: FinalTestDto;
}
