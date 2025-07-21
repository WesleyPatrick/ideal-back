import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../../error/exception";

class SentenceResponseDto {
  @ApiProperty({
    description: "Unique identifier of the sentence",
    example: "cmc6n801u007wjhg9p9ho58t5"
  })
  id: string;

  @ApiProperty({
    description: "Speaker or character in the sentence",
    example: "SOLINHO"
  })
  person: string;

  @ApiProperty({
    description: "Position index of the sentence in the dialogue",
    example: 0
  })
  index: number;

  @ApiProperty({
    description: "Text content of the sentence",
    example: "Introdução à missão B"
  })
  text: string;

  @ApiProperty({
    description: "ID of the dialog activity this sentence belongs to",
    example: "cmc6n801u007vjhg9pp6a4lo5"
  })
  dialogActivityId: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2025-06-21T19:39:59.683Z"
  })
  createdAt: string;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2025-06-21T19:39:59.683Z"
  })
  updatedAt: string;
}

export class DialogActivityResponseDto {
  @ApiProperty({
    description: "Unique identifier of the dialog activity",
    example: "cmc6n801u007vjhg9pp6a4lo5"
  })
  id: string;

  @ApiProperty({
    description: "Amount of solecas earned by completing the activity",
    example: 10
  })
  solecasAmount: number;

  @ApiProperty({
    description: "Position of the step in which this activity is located",
    example: 0
  })
  stepPosition: number;

  @ApiProperty({
    description: "Identifier of the step this activity belongs to, if any",
    example: null,
    nullable: true
  })
  stepId: string | null;

  @ApiProperty({
    description:
      "Identifier of the final test this activity belongs to, if any",
    example: null,
    nullable: true
  })
  finalTestId: string | null;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2025-06-21T19:39:59.683Z"
  })
  createdAt: string;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2025-06-21T19:39:59.683Z"
  })
  updatedAt: string;

  @ApiProperty({
    type: [SentenceResponseDto],
    description: "List of sentences in the dialog"
  })
  sentences: SentenceResponseDto[];
}

export const FindDialogActivityWithSentencesResponses = applyDecorators(
  ApiOkResponse({
    description: "Return all dialog activity with sentences",
    type: DialogActivityResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a dialog activity with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
