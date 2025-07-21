import { applyDecorators } from "@nestjs/common";
import {
  ApiProperty,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class MissionDTO {
  @ApiProperty({
    description: "Mission ID",
    example: "cm98turvw0007z0ixjrudw1vt"
  })
  id: string;

  @ApiProperty({
    description: "Title of the mission",
    example: "Graph Theory Basics"
  })
  title: string;

  @ApiProperty({
    description: "Initial video file (if any)",
    example: null,
    nullable: true
  })
  initialVideo: string | null;

  @ApiProperty({
    description: "Article file (if any)",
    example: null,
    nullable: true
  })
  articleFile: string | null;

  @ApiProperty({
    description: "Index of the mission in the module",
    example: 0
  })
  index: number;

  @ApiProperty({
    description: "Completion status",
    example: false
  })
  isCompleted: boolean;

  @ApiProperty({
    description: "Mission color",
    example: "#213123"
  })
  color: string;

  @ApiProperty({
    description: "Module ID this mission belongs to",
    example: "cm98turvr0003z0ix98d4f4ql"
  })
  moduleId: string;

  @ApiProperty({
    description: "Date when the mission was created",
    example: new Date().toISOString()
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date when the mission was last updated",
    example: new Date().toISOString()
  })
  updatedAt: Date;
}

export const MissionListResponses = applyDecorators(
  ApiOkResponse({
    description: "List of missions retrieved successfully",
    type: MissionDTO,
    isArray: true
  }),
  ApiBadRequestResponse({
    description: "Invalid request parameters",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a module with this id"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
