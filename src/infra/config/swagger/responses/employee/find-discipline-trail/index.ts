import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExceptionResponseDto } from "../../error/exception";

export class StepAccessDto {
  @ApiProperty({
    example: "cmbt0reeo0081jf5rdvz73flg",
    description: "Unique identifier of the step"
  })
  stepId: string;

  @ApiProperty({
    example: 0,
    description: "Index of the step inside the mission"
  })
  stepIndex: number;

  @ApiProperty({
    example: 3,
    description: "Total number of correct activities in the step"
  })
  activitiesCorrect: number;

  @ApiProperty({
    example: 3,
    description: "Total number of incorrect activities in the step"
  })
  activitiesIncorrect: number;

  @ApiProperty({
    example: true,
    description: "Indicates if the step is fully completed"
  })
  isCompleted: boolean;
}

export class FinalTestAccessDto {
  @ApiProperty({
    example: "cmbt0refz00ejjf5rspl1lj1d",
    description: "Unique identifier of the final test"
  })
  id: string;

  @ApiProperty({
    example: 100,
    description: "Solecas amount of the final test"
  })
  finalTestSolecas: number;

  @ApiProperty({
    example: true,
    description: "Indicates if the final test has been completed"
  })
  isComplete: boolean;
}

export class MissionDto {
  @ApiProperty({
    example: "cmcj41u5u0003tfjh8xhl7rix",
    description: "Id of the mission"
  })
  missionId: string;

  @ApiProperty({
    example: 0,
    description: "Index of the mission within the module"
  })
  missionIndex: number;

  @ApiProperty({
    example: "Missão A",
    description: "Title or name of the mission"
  })
  missionName: string;

  @ApiProperty({
    example: "https://video.com/videoA.mp4",
    nullable: true,
    description: "URL to the mission introduction video"
  })
  missionVideoUrl: string | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: "Optional reference to a dialog activity within the mission"
  })
  missionDialogActivityId: string | null;

  @ApiProperty({
    example: "fileA.pdf",
    description:
      "Filename or URL of the article file associated with the mission"
  })
  missionArticleFile: string;

  @ApiProperty({
    type: [StepAccessDto],
    description: "List of steps within the mission"
  })
  @Type(() => StepAccessDto)
  steps: StepAccessDto[];

  @ApiProperty({
    type: FinalTestAccessDto,
    description: "Final test status and identifier"
  })
  @Type(() => FinalTestAccessDto)
  finalTest: FinalTestAccessDto;
}
export class FindModuleTrailResponseDto {
  @ApiProperty({
    example: "cmcj418mm0002tfjh2ob23fht",
    description: "Id of the discipline"
  })
  disciplineId: string;

  @ApiProperty({
    example: "Formação WebPrestador",
    description: "Name of the discipline"
  })
  disciplineName: string;

  @ApiProperty({
    example: "cmcj41u5u0003tfjh8xhl7rix",
    description: "Id of the module"
  })
  moduleId: string;

  @ApiProperty({
    example: "Faturamento",
    description: "Name of the module"
  })
  moduleName: string;

  @ApiProperty({
    type: [MissionDto],
    description: "List of missions associated with the module"
  })
  @Type(() => MissionDto)
  missions: MissionDto[];
}

export const FindModuleTrailResponses = applyDecorators(
  ApiOkResponse({
    description: "Returns all the user's progress in that module",
    type: FindModuleTrailResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found employee or discipline with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
