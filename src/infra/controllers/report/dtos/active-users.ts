import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DefaultReportDTO {
  @ApiPropertyOptional({
    description: "Service Provider Id",
    example: "cmawfobxf00030dl1648khtey"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  serviceProviderId?: string;

  @ApiPropertyOptional({
    description: "Employee Id",
    example: "cmawfp2sa00040dl1bigz1ta2"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employeeId?: string;
}
