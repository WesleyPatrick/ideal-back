import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllOperatorsDTO {
  @ApiProperty({
    description: "Page number",
    example: 1
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @ApiProperty({
    description: "Number of results per page",
    example: 10
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageSize: number;
}
