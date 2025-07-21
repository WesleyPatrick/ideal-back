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

export class FindAllDisciplineByEmployeeIdResponse {
  @ApiProperty({
    description: "Id of the discipline",
    example: "cva92m37rk00018a7an36l8fml"
  })
  disciplineId: string;

  @ApiProperty({
    description: "Title of the discipline",
    example: "Disciplina A"
  })
  disciplineTitle: string;

  @ApiProperty({
    description: "Color associated with the discipline",
    example: "#2B95F6"
  })
  disciplineColor: string;

  @ApiProperty({
    description: "URL or path of the discipline cover image",
    example: "https://example.com/image.jpg"
  })
  disciplineCover: string;
}

export const FindAllEmployeeDisciplinesResponses = applyDecorators(
  ApiOkResponse({
    description: "All disciplines who this employee have access",
    type: [FindAllDisciplineByEmployeeIdResponse]
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiNotFoundResponse({
    description: "Not found a employee with this id"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Error"
  })
);
