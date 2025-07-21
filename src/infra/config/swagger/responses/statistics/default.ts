import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from "@nestjs/swagger";
import { ExceptionResponseDto } from "../error/exception";

export class MetricDTO {
  @ApiProperty({ example: "assertiveness_by_activity" })
  key: string;

  @ApiProperty({ example: "50" })
  value: string;
}

export class MetricsResponseDTO {
  @ApiProperty({
    type: [MetricDTO],
    example: [
      { key: "assertiveness_by_activity", value: "50" },
      { key: "completion_time_avg", value: "4.5" },
      { key: "module_accuracy_avg", value: "50" },
      { key: "error_rate", value: "50" },
      { key: "return_time_avg", value: "2.52" }
    ]
  })
  metrics: MetricDTO[];
}

export const StatisticsResponses = applyDecorators(
  ApiOkResponse({
    type: MetricsResponseDTO,
    description: "Metrics retrieved successfully"
  }),
  ApiBadRequestResponse({
    description: "Invalid request",
    type: ExceptionResponseDto
  }),
  ApiInternalServerErrorResponse({
    description: "Internal server error"
  })
);
