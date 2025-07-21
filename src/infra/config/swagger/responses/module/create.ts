import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class ModuleDTO {
  @ApiProperty({
    description: "Module ID",
    example: "cm98do8h400021vxkt4akxexk"
  })
  id: string;

  @ApiProperty({
    description: "Title of the module",
    example: "Introduction 1"
  })
  title: string;

  @ApiProperty({ description: "Index of the module", example: 2 })
  index: number;

  @ApiProperty({
    description: "Completion status of the module",
    example: false
  })
  isCompleted: boolean;

  @ApiProperty({
    description: "CUID of the related discipline",
    example: "cm979e4sw00017fnfuzeor2wq"
  })
  disciplineId: string;

  @ApiProperty({
    description: "Creation date of the module",
    example: "2025-04-08T10:49:06.280Z"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update date of the module",
    example: "2025-04-08T10:49:06.280Z"
  })
  updatedAt: Date;
}

export class CreateModuleResponseDto {
  @ApiProperty({ type: () => ModuleDTO })
  module: ModuleDTO;

  @ApiProperty({
    description: "Titles of the created missions",
    type: [String],
    example: ["Mission 1: Teste", "Mission 2: Teste", "Mission 3: Teste"]
  })
  missionsTitles: string[];
}

export const CreateModuleResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Module created successfully",
    type: CreateModuleResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  })
);
