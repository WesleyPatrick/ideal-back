import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class FinishedConclusionDTO {
  @ApiProperty({
    description: "ID of the user to finalize the conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: "ID of the discipline to finalize the conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  disciplineId?: string;

  @ApiPropertyOptional({
    description: "ID of the module to finalize the conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  moduleId?: string;

  @ApiPropertyOptional({
    description: "ID of the mission to finalize the conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  missionId?: string;

  @ApiPropertyOptional({
    description: "ID of the step to finalize the conclusion",
    example: "ckw3n6bxf0000yzl4o4n4i0q0"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  stepId?: string;
}
