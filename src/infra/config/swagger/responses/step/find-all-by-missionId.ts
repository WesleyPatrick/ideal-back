import { applyDecorators } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";

export class ActivityResumeDto {
  @ApiProperty({
    description: "Activity unique identifier",
    example: "cma7ey0cj0026s7h559a2qdm4"
  })
  id: string;

  @ApiProperty({
    description: "Position of the activity in the step",
    example: 0
  })
  index: number;
}

export class StepWithActivitiesDto {
  @ApiProperty({
    description: "Step unique identifier",
    example: "cma7ey0ci0024s7h5rqzd0tjm"
  })
  id: string;

  @ApiProperty({
    description: "Step title",
    example: "Step 5: Introduction"
  })
  title: string;

  @ApiProperty({
    description: "List of activities belonging to the step",
    type: [ActivityResumeDto]
  })
  activities: ActivityResumeDto[];
}

export const FindAllStepsByMissionIdResponses = applyDecorators(
  ApiOkResponse({
    description: "List of steps with activities resume",
    type: StepWithActivitiesDto,
    isArray: true
  }),
  ApiNotFoundResponse({
    description: "Not found a mission with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
