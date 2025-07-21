import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsUniqueArray } from "@infra/utils/validate-unique-array";

export class StepMissionDto {
  @ApiProperty({
    description: "The ID of the mission containing the steps",
    example: "clv1x9zpc0000abc123456789"
  })
  @IsString()
  missionId: string;

  @ApiProperty({
    description:
      "List of step IDs that the profile is allowed to access within the mission",
    example: ["clv1ya3t60001abc123456789", "clv1ya3t60002abc123456789"]
  })
  @IsArray()
  @IsUniqueArray()
  @IsString({ each: true })
  steps: string[];
}

export class ModuleAccessDto {
  @ApiProperty({
    description: "The ID of the module within the discipline",
    example: "clv1x93o0001abc123456789"
  })
  @IsString()
  moduleId: string;

  @ApiProperty({
    description: "List of missions with their respective steps",
    type: [StepMissionDto]
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StepMissionDto)
  missions: StepMissionDto[];
}

export class DisciplineAccessDto {
  @ApiProperty({
    description: "The ID of the discipline the profile will have access to",
    example: "clv1x8yk0000abc123456789"
  })
  @IsString()
  disciplineId: string;

  @ApiProperty({
    description: "List of modules within the discipline",
    type: [ModuleAccessDto]
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ModuleAccessDto)
  modules: ModuleAccessDto[];
}

export class CreateEmployeeProfileDto {
  @ApiProperty({
    description: "The name of the profile to be created",
    example: "Reception Profile"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Id of the operator that profile belongs to",
    example: "cmadxs38h00010cif7sxb0zik"
  })
  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @ApiProperty({
    description:
      "List of disciplines with allowed modules, missions, and steps",
    type: [DisciplineAccessDto]
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DisciplineAccessDto)
  disciplines: DisciplineAccessDto[];
}
