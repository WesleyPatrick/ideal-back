import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class EditDisciplineDTO {
  @ApiPropertyOptional({ description: "Discipline title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Author of the discipline" })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: "Short resume or summary of the discipline"
  })
  @IsOptional()
  @IsString()
  resume?: string;
}
