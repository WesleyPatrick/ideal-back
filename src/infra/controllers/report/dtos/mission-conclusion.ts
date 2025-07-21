import { ApiPropertyOptional } from "@nestjs/swagger";
import { DefaultReportDTO } from "./active-users";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ReportDTO extends DefaultReportDTO {
  @ApiPropertyOptional({
    description: "Operator Id",
    example: "cmawwnxxq00080dl6gdhd4ue1"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  operatorId?: string;
}
